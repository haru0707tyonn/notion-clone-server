const router = require("express").Router();
const memoController = require("../controllers/memo"); // 78
const tokenHandler = require("../handlers/tokenHandler"); 

// メモを作成
router.post("/", tokenHandler.verifyToken, memoController.create);

// ログインしているユーザーが投稿したメモをすべて取得
router.get("/", tokenHandler.verifyToken, memoController.getAll);

// ログインしているユーザーが投稿したメモを1つ取得
router.get("/:memoId", tokenHandler.verifyToken, memoController.getOne);

// ログインしているユーザーが投稿したメモを1つ更新 92
router.put("/:memoId", tokenHandler.verifyToken, memoController.update);

// ログインしているユーザーが投稿したメモを1つ削除 95
router.delete("/:memoId", tokenHandler.verifyToken, memoController.delete);

module.exports = router;