import mongoose from "mongoose";

const gigSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    budget: {
        type: Number,
        required: true,
    },
    vacancies: {
        type: Number,
        default: 1,
    },
    status: {
        type: String,
        enum: ['open', 'assigned'],
        default: 'open',
    },
}, { timestamps: true });

// Index for search (Bonus: Text Search)
gigSchema.index({ title: 'text' });

export default mongoose.model("Gig", gigSchema);
