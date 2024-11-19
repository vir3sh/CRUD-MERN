const jwt = require('jsonwebtoken');

// Admin authentication middleware
const adminAuth = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'No token provided, access denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if user is an admin
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only' });
        }

        req.adminId = decoded.id; // Attach admin ID to the request object
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token', error });
    }
};

module.exports = adminAuth;
