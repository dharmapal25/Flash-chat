const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UsersCollection = require('../Models/users.model');

const generateTokens = (userId) => {
    const accessToken = jwt.sign(
        { userId },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { userId },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};

const register = async (req, res) => {
    try {
        const { username, email, password, confirmPassword, gender } = req.body;

        // Validation
        if (!username || !email || !password || !confirmPassword || !gender) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Check if user already exists
        const existingUser = await UsersCollection.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = new UsersCollection({
            username,
            email,
            password: hashedPassword,
            Gender: gender,
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.log('Register error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user
        const user = await UsersCollection.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user._id);

        // Set refresh token in cookie (httpOnly for security)
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({
            message: 'Login successful',
            accessToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
            },
        });
    } catch (error) {
        console.log('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token not found' });
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const newAccessToken = jwt.sign(
            { userId: decoded.userId },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        console.log('Refresh token error:', error);
        res.status(401).json({ message: 'Invalid refresh token' });
    }
};

const logout = (req, res) => {
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
    register,
    login,
    refreshAccessToken,
    logout,
};
