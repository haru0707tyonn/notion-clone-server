const JWT = require("jsonwebtoken"); // 19 npm i jsonwebtoken
const CryptoJS = require("crypto-js"); // npm i crypto-js
const User = require("../models/user"); // 17

exports.register = async (req, res) => {
    // パスワードの受け取り
    const password = req.body.password; // リクエストから来たボディーの中のパスワードフィールドを見る

    try {
        // パスワードの暗号化 シークレットキーは.envファイルで保護
        req.body.password = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY); // 共通鍵暗号方式　第一引数は暗号化したい文字列。第二引数はシークレットキー（ランダムな文字列（自分で決める））
        // ユーザーの新規作成
        const user = await User.create(req.body); // MongoDBでユーザーが作成される DataService -> Collectionsから内容を確認できる
        // JWT（次回からのログインを楽にするトークン）npm i jsonwebtoken
        const token = JWT.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
            expiresIn: "24h", // 24時間JWTを割り当て
        }); // MongoDBに登録してある各ユーザーに割り振られたIDをもとにJWTを発行, シークレットキー, どれだけの期間割り当てるかを設定
        return res.status(200).json({ user, token }); // クライアントにユーザーとトークンの情報を返す
    } catch (err) {
        return res.status(500).json(err);
    }
};


// ユーザーログイン用API　28
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // DBからユーザーが存在するか探してくる
        const user = await User.findOne({ username: username })
        if(!user) {
            return res.status(401).json({ 
                    errors: [// 配列を付け加える60 そうすることでforEachで展開できる
                        { 
                            path: "username", // paramと設定したかったがアカウント作成のときにpathになってしまうのでpathに統一した
                            msg: "ユーザー名が無効です"
                        },
                    ],
            });
        }

        // パスワードがあっているか照合する 29
        const descryptedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.SECRET_KEY
        ).toString(CryptoJS.enc.Utf8); // 30 これを書くことにより文字列として認識される

        if(descryptedPassword !== password) {
            return res.status(401).json({
                    errors: [
                        {
                            path: "password", // paramと設定したかったがアカウント作成のときにpathになってしまうのでpathに統一した
                            msg: "パスワードが無効です"
                        },
                    ]
            });
        }

        // JWTを発行
        const token = JWT.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
            expiresIn: "24h", // 24時間JWTを割り当て
        });

        return res.status(201).json({ user, token });


    } catch (err) {
        return res.status(500).json(err);
    }
};