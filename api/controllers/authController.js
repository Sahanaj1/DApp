const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require('../models/User');


exports.register = async (req, res) => {
    try {
        const hasedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hasedPassword,
            walletAddress: req.body.walletAddress
        });
        await newUser.save();

        res.status(201).json({ message: "user registered successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username })

        if (!user) {
            res.status(401).json({ message: ' User doesnt exist' });
        }

        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ message: 'Invalid Password' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ token: token })
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}