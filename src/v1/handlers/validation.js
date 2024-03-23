// 27 リファクタリング

const { validationResult } = require("express-validator"); // 22 npm install express-validator

exports.validate = (req, res, next) => {
    const errors = validationResult(req); // 24 エラーがある場合にerrorsに格納される
    if(!errors.isEmpty()) { // errorsがある場合
        return res.status(400).json({ errors: errors.array() }); // 上に記述したエラーメッセージを表示される
    }
    next(); // 次に行く（下の）　ミドルウェアにはnextを記述する必要がある　もしここのif分で引っかかった場合は次（下）に行かない
};