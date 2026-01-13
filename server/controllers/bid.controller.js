import Bid from "../models/Bid.js";
import Gig from "../models/Gig.js";
import mongoose from "mongoose";

export const createBid = async (req, res) => {
    if (!req.userId) return res.status(403).json({ message: "Not authenticated!" });

    const newBid = new Bid({
        ...req.body,
        freelancerId: req.userId,
    });

    try {
        const savedBid = await newBid.save();
        res.status(201).json(savedBid);
    } catch (err) {
        // Handle duplicate bid error
        if (err.code === 11000) return res.status(400).json({ message: "You have already bid on this gig." });
        res.status(500).json({ message: "Failed to place bid" });
    }
};

export const getBidsByGig = async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.gigId);
        if (!gig) return res.status(404).json({ message: "Gig not found" });

        // Only owner should see bids? Or everyone?
        // Requirement: "The Client who posted the job sees a list of all Bids."
        // Implies mainly for owner. But maybe freelancers want to see competition? Let's check logic.
        // "Review: The Client who posted the job sees a list of all Bids." -> Safe to restrict to owner for full details, but public might see count.

        // For now, let's allow fetching. If security is critical, check ownerId.
        if (gig.ownerId.toString() !== req.userId) {
            // Optional: return res.status(403).json({ message: "Only owner can view bids" }); 
            // But for testing simplicity, I'll allow it for now or stick to req.
            // Let's implement restriction to match "The Client... sees".
            return res.status(403).json({ message: "Only the gig owner can view bids." });
        }

        const bids = await Bid.find({ gigId: req.params.gigId }).populate('freelancerId', 'name email');
        res.status(200).json(bids);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch bids" });
    }
};

export const hireFreelancer = async (req, res) => {
    const { bidId } = req.params;

    // Start Transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const bid = await Bid.findById(bidId).session(session);
        if (!bid) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Bid not found" });
        }

        const gig = await Gig.findById(bid.gigId).session(session);
        if (!gig) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Gig not found" });
        }

        // Security Check: Only owner can hire
        if (gig.ownerId.toString() !== req.userId) {
            await session.abortTransaction();
            session.endSession();
            return res.status(403).json({ message: "You are not the owner of this gig!" });
        }

        if (gig.status !== 'open' || gig.vacancies <= 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "This gig is already assigned/closed or has no vacancies." });
        }

        // 1. Decrement Vacancies
        gig.vacancies = gig.vacancies - 1;

        // 2. Check if should close
        let closed = false;
        if (gig.vacancies <= 0) {
            gig.status = 'assigned';
            closed = true;
        }
        await gig.save({ session });

        // 3. Update chosen Bid status
        bid.status = 'hired';
        await bid.save({ session });

        // 4. If closed, reject other bids (Optional, but good cleanup)
        if (closed) {
            await Bid.updateMany(
                { gigId: bid.gigId, status: 'pending' },
                { status: 'rejected' }
            ).session(session);
        }

        await session.commitTransaction();
        session.endSession();

        // Bonus 2: Real-time Notification
        // Wrap in try-catch to ensure response is sent even if socket fails
        try {
            const freelancerSocketId = global.onlineUsers.get(bid.freelancerId.toString());
            if (freelancerSocketId) {
                req.io.to(freelancerSocketId).emit("notification", {
                    message: `Congrats, you have been hired as a ${gig.title}`
                });
            }
        } catch (socketErr) {
            console.error("Socket emission failed:", socketErr);
        }

        res.status(200).json({ message: "Freelancer hired successfully!", gigName: gig.title, vacanciesLeft: gig.vacancies });

    } catch (err) {
        // Only abort if transaction hasn't been committed/ended yet
        // Since we endSession right after commit, we can check if session is still in transaction? 
        // Best approach: Use a flag or check error type.
        // If "Transaction already committed" error, ignore abort.
        try {
            await session.abortTransaction();
        } catch (abortErr) {
            // Ignore if already committed/aborted
        }

        session.endSession();
        console.error("Transaction Error:", err);
        res.status(500).json({ message: "Hiring failed due to an error." });
    }
};

export const getMyBid = async (req, res) => {
    try {
        const bid = await Bid.findOne({ gigId: req.params.gigId, freelancerId: req.userId });
        if (!bid) return res.status(200).json(null); // Return null properly if no bid
        res.status(200).json(bid);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch your bid" });
    }
};

export const deleteBid = async (req, res) => {
    try {
        const bid = await Bid.findById(req.params.id);
        if (!bid) return res.status(404).json({ message: "Bid not found" });

        if (bid.freelancerId.toString() !== req.userId) {
            return res.status(403).json({ message: "You can only delete your own bid" });
        }

        await Bid.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Bid deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete bid" });
    }
};

export const updateBid = async (req, res) => {
    try {
        const bid = await Bid.findById(req.params.id);
        if (!bid) return res.status(404).json({ message: "Bid not found" });

        if (bid.freelancerId.toString() !== req.userId) {
            return res.status(403).json({ message: "You can only update your own bid" });
        }

        if (bid.status !== 'pending') {
            return res.status(400).json({ message: "Cannot edit bid after it has been processed." });
        }

        bid.price = req.body.price || bid.price;
        bid.message = req.body.message || bid.message;

        const updatedBid = await bid.save();
        res.status(200).json(updatedBid);
    } catch (err) {
        res.status(500).json({ message: "Failed to update bid" });
    }
};

export const getBids = async (req, res) => {
    try {
        const filters = {
            ...(req.query.freelancerId && { freelancerId: req.query.freelancerId }),
            ...(req.query.gigId && { gigId: req.query.gigId })
        };

        const bids = await Bid.find(filters)
            .populate('gigId', 'title') // Populate gig title for MyBids view
            .populate('freelancerId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json(bids);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch bids" });
    }
};
