import Gig from "../models/Gig.js";

export const createGig = async (req, res) => {
    if (!req.userId) return res.status(403).json({ message: "Not authenticated!" });

    // Capitalization Logic
    const title = req.body.title ? req.body.title.toUpperCase() : "";
    const description = req.body.description
        ? req.body.description.replace(/\b\w/g, char => char.toUpperCase())
        : "";

    const newGig = new Gig({
        ...req.body,
        title,
        description,
        ownerId: req.userId,
    });

    try {
        const savedGig = await newGig.save();
        res.status(201).json(savedGig);
    } catch (err) {
        res.status(500).json({ message: "Failed to create gig" });
    }
};

export const getGigs = async (req, res) => {
    const q = req.query;
    const filters = {
        ...(q.userId ? { ownerId: q.userId } : { status: 'open' }), // If filtering by user, show all. Else, only open.
        ...(q.search && { title: { $regex: q.search, $options: "i" } }),
    };

    try {
        const gigs = await Gig.find(filters).populate('ownerId', 'name email').sort({ createdAt: -1 });
        res.status(200).json(gigs);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch gigs" });
    }
};

export const getGig = async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id).populate('ownerId', 'name email');
        if (!gig) return res.status(404).json({ message: "Gig not found" });
        res.status(200).json(gig);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch gig" });
    }
};

export const deleteGig = async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id);
        if (!gig) return res.status(404).json({ message: "Gig not found" });

        if (gig.ownerId.toString() !== req.userId) {
            return res.status(403).json({ message: "You can only delete your own gig!" });
        }

        await Gig.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Gig deleted successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete gig" });
    }
};

export const updateGig = async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id);
        if (!gig) return res.status(404).json({ message: "Gig not found" });

        if (gig.ownerId.toString() !== req.userId) {
            return res.status(403).json({ message: "You can only update your own gig!" });
        }

        // Capitalization Logic for updates
        if (req.body.title) req.body.title = req.body.title.toUpperCase();
        if (req.body.description) req.body.description = req.body.description.replace(/\b\w/g, c => c.toUpperCase());

        const updatedGig = await Gig.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true }).populate('ownerId', 'name email');

        res.status(200).json(updatedGig);
    } catch (err) {
        res.status(500).json({ message: "Failed to update gig" });
    }
};
