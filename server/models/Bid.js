import mongoose from "mongoose";

const bidSchema = new mongoose.Schema({
    gigId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gig',
        required: true,
    },
    freelancerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'hired', 'rejected'],
        default: 'pending',
    },
}, { timestamps: true });

// Prevent multiple bids from same freelancer on same gig? (Optional logical constraint)
bidSchema.index({ gigId: 1, freelancerId: 1 }, { unique: true });

export default mongoose.model("Bid", bidSchema);
