const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
    console.log("新しいクライアントが接続しました");

    // 10秒ごとにクイズ開始メッセージを送信
    setInterval(() => {
        let correctAnswer = Math.floor(Math.random() * 4) + 1;
        let timeLimit = 10; // 回答可能秒数

        ws.send(JSON.stringify({
            type: "start_quiz",
            correctAnswer: correctAnswer,
            timeLimit: timeLimit
        }));
    }, 15000);
});