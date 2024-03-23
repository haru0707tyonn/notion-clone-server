const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 5000;
require("dotenv").config(); // 14 これを書くことにより process.envが使えるようになる envファイルに記述したものは第三者からみられる心配がなくなる npm i -D dotenv
const cors = require("cors"); // npm i cors // CORSエラー（PORT番号エラー）を解決するために 51

app.use(cors({
    origin: "http://localhost:3000", // 3000番での通信はエラーが発生しなくなる
})
);
app.use(express.json()); // 21 JSONオブジェクトを認識できるようになる　これがないとPostmanがつかえない
app.use("/api/v1", require("./src/v1/routes")); // 26 routesのAPIを呼び出すためには第一引数のエンドポイントを記述する必要があるという設定 第二引数はそれを適応させるパス



// DB接続
try {
    mongoose.connect(
        process.env.MONGODB_URL
    ); // ② 13 MongoDBのConnextから <password>の部分に設定したパスワードを、一番最後の&appName=Cluster0はなくてOK
    console.log("DBと接続中・・・");
} catch (error) {
    console.log(error);
}


app.listen(PORT, () => {
    console.log("ローカルサーバー起動中・・・");
});