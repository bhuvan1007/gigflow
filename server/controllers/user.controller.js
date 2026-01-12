import User from "../models/User.js";

export const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (req.userId !== user._id.toString()) {
        return res.status(403).send("You can delete only your account!");
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).send("deleted.");
};

export const updateUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (req.userId !== user._id.toString()) {
        return res.status(403).send("You can update only your account!");
    }

    try {
        const { password, ...others } = req.body; // Prevent password update via this route for simplicity, or handle it carefully

        // Basic update logic
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: others,
        }, { new: true });

        const { password: userPassword, ...info } = updatedUser._doc;
        res.status(200).json(info);
    } catch (err) {
        res.status(500).send("Failed to update user!");
    }
};
