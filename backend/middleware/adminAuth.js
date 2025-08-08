const adminAuth = (req, res, next) => {    const validAdmins = [
        'lovelyboyarun91@gmail.com',
        'chanvifarms9@gmail.com'
    ];
    
    const adminEmail = req.headers['admin-email'];
    
    if (!adminEmail || !validAdmins.includes(adminEmail)) {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin privileges required."
        });
    }
    
    next();
};

export default adminAuth;