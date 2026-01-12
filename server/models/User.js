import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String, // 'Client' or 'Freelancer' (can be inferred, but let's keep it fluid)
        default: "user",
    },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
