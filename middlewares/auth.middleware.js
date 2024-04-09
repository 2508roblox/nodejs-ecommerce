const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    // Lấy giá trị của header 'Authorization'
    const authHeader = req.headers.authorization;
console.log(authHeader);
    if (authHeader) {
        // Giá trị header 'Authorization' có dạng 'Bearer <token>'
        const token = authHeader.split(' ')[1];

        // Xác thực JWT token
        jwt.verify(token, 'your-access-token-secret', (err, user) => {
            if (err) {
                // Token không hợp lệ
                return res.sendStatus(403);
            }

            // Token hợp lệ, lưu thông tin người dùng vào req.user
            req.user = user;

            // Tiếp tục xử lý các middleware hoặc route tiếp theo
            next();
        });
    } else {
        // Không có header 'Authorization'
        res.sendStatus(401);
    }
}

module.exports = authMiddleware;