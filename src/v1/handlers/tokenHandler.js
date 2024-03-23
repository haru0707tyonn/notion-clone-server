const JWT = require("jsonwebtoken");
const User = require("../models/user");

// クライアントから渡されたJWTが正常か検証 33
const tokenDecode = (req) => {
  // リクエストヘッダーからauthorizationフィールドを指定してベアラトークンを取得する。
  const bearerHeader = req.headers["authorization"]; // クライアントのauthorizationを覗く
    if(bearerHeader) {
        const bearer = bearerHeader.split(" ")[1]; // 空白で区切る場合の配列の1番目の要素
        try {
            const decodedToken = JWT.verify(bearer, process.env.TOKEN_SECRET_KEY); // bearerをprocess.env.TOKEN_SECRET_KEYデコードする
            return decodedToken; 
        } catch {
            return false;
        }
    } else {
        return false;
    }
};

// JWT認証を検証するためのミドルウェア 32 34
exports.verifyToken = async (req, res, next) => {
    const tokenDecoded = tokenDecode(req);
    if(tokenDecoded) {
        // そのJWTと一致するユーザーを探してくる
        const user = await User.findById(tokenDecoded.id);
        if(!user) {
            return res.status(401).json("権限がありません");
        }
        req.user = user;
        next();
    } else {
        return res.status(401).json("権限がありません");
    }
};