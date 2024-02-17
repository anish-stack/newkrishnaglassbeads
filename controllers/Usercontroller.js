const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/user.model");

// Register
exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if any field is empty
        if (!email || !password) {
            return res.status(400).json({
                status: false,
                message: "Please provide email and password",
            });
        }

        // Check if a user with this email already exists
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                status: false,
                message: "User already exists",
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with the hashed password
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        return res.status(200).json({
            status: true,
            message: 'User registered successfully',
            data: newUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input fields
        if (!email || !password) {
            return res.status(400).json({
                status: false,
                message: "Please provide an email and a password",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                status: false,
                message: "User not found with this email",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                status: false,
                message: "Invalid password",
            });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({
            status: true,
            message: 'Login successful',
            token: token,
            user: {
                id: user._id,
                email: user.email
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

exports.forgetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        // Validate input fields
        if (!email || !newPassword) {
            return res.status(400).json({
                status: false,
                message: "Please provide email and new password",
            });
        }

        // Check if the user with the provided email exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                status: false,
                message: "User not found with this email",
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password in the database
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            status: true,
            message: 'Password reset successful',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

exports.logout = (req, res) => {
    // Clear the authentication token from the client by setting an expired cookie
    res.cookie('token', '', { expires: new Date(0) });

    return res.status(200).json({
        status: true,
        message: 'Logout successful',
    });
};