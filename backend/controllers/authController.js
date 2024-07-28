const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse');

// Signup Controller
exports.signup = async (req, res, next) => {
    const { email } = req.body;
    try {
        const userExist = await User.findOne({ email });
        if (userExist) {
            return next(new ErrorResponse("E-mail already registered", 400));
        }
        const user = await User.create(req.body);
        res.status(201).json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
};

// Signin Controller
exports.signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        // Validation
        if (!email) {
            return next(new ErrorResponse("Please add an email", 403));
        }
        if (!password) {
            return next(new ErrorResponse("Please add a password", 403));
        }

        // Check user email
        const user = await User.findOne({ email });
        if (!user) {
            return next(new ErrorResponse("Invalid credentials", 400));
        }

        // Check password
        const isMatched = await user.comparePassword(password);
        if (!isMatched) {
            return next(new ErrorResponse("Invalid credentials", 400));
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// Send Token Response
const sendTokenResponse = async (user, codeStatus, res) => {
    const token = await user.getJwtToken();
    res
        .status(codeStatus)
        .cookie('token', token, { maxAge: 60 * 60 * 1000, httpOnly: true })
        .json({
            success: true,
            role: user.role
        });
};

// Logout Controller
exports.logout = (req, res, next) => {
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        message: "Logged out"
    });
};

// User Profile Controller
exports.userProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
};
