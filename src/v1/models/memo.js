const mongoose = require("mongoose");
// (76に別の書き方もある)

const memoSchema = new mongoose.Schema({ // 75
    user: {
        type: mongoose.Schema.Types.ObjectId, // ユーザーのオブジェクトIDを指定
        ref: "User", // refでUserを指定するとuser.jsのユーザーモデル（最後のmodule.exportsの名前）UserのオブジェクトID　75
        required: true,
    },
    icon: {
        type: String,
        default: "📝",
    },
    title: {
        type: String,
        default: "無題",
    },
    description: {
        type: String,
        default: "ここに自由に記入してください"
    },
    position: {
        type: Number,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    favoritePosition: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model("Memo", memoSchema);