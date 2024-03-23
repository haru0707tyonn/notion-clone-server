const router = require("express").Router();
const { body } = require("express-validator"); // 22 npm install express-validator

require("dotenv").config(); // 14 これを書くことにより process.envが使えるようになる envファイルに記述したものは第三者からみられる心配がなくなる npm i -D dotenv
const User = require("../models/user"); // 17

const validation = require("../handlers/validation"); // 27
const userController = require("../controllers/user"); // 27
const tokenHandler = require("../handlers/tokenHandler"); // 34

// ユーザー新規登録API
router.post(
    "/register", // エンドポイント
    body("username")
        .isLength({ min: 8 })
        .withMessage("ユーザー名は8文字以上である必要があります"), // 7文字以下の場合に表示されるメッセージ
    body("password")
        .isLength({ min:8 })
        .withMessage("パスワードは8文字以上である必要があります"),
    body("confirmPassword")
        .isLength({ min:8 })
        .withMessage("確認用パスワードは8文字以上である必要があります"),
    body("username").custom((value) => { // 23 カスタムバリデーション　DBにユーザーが存在している場合の処理
        return User.findOne({username: value}).then((user) => { // findOneは usernameがvalueと等しい場合にそれをuserに格納する
            if(user) { // ユーザーが存在する場合
                return Promise.reject("このユーザーはすでに使われています"); // 公式ドキュメントどうり
            }
        });
    }), // カンマを忘れずに

    validation.validate, // 27
    userController.register // 27
);

// ログイン用API 28
router.post(
    "/login", 
    body("username")
        .isLength({ min: 8 })
        .withMessage("ユーザー名は8文字以上である必要があります"),
    body("password")
        .isLength({ min: 8 })
        .withMessage("パスワードは8文字以上である必要があります"),
    validation.validate,
    userController.login
);

// JWT認証API 32
router.post("/verify-token", tokenHandler.verifyToken, (req, res) => {
    return res.status(200).json({ user: req.user }); // nextに当たらないとここまでこない
});


module.exports = router;