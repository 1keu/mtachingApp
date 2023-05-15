const { v4: uuidv4 } = require("uuid");
const express = require("express");
const router = express.Router();
const { initSocket } = require('../socket');


router.post('/random-match', (req, res) => {

    // ランダムマッチのロジックを実行する
    const queue = []; // マッチング待機キュー

    // マッチングを開始するときの処理
    function startMatching(socket) {
        socket = 2;
        queue.push(socket);
        // キューが空でない場合はマッチングを行う
        if (queue.length >= 2) {
            const users = queue.splice(0, 2); // キューから2人のユーザーを取り出す
            startCall(users); // 通話を開始する
        }
    }

    // 通話を開始する処理
    function startCall(users) {
        const roomId = generateRoomId(); // 通話のためのルームIDを生成
        for (const user of users) {
            user.emit('callStarted', roomId);
        }
    }

    // ユーザーが切断したときの処理
    function handleDisconnect(socket) {
        console.log('ユーザーが切断しました:', socket.id);
        const index = queue.indexOf(socket);
        if (index !== -1) {
            queue.splice(index, 1); // キューから削除する
        }
    }

    // 通話のためのランダムなルームIDを生成する関数
    function generateRoomId() {
        return uuidv4();
    }

    // Socket.io を使ってクライアントとのリアルタイム通信を行う
    const io = initSocket(req.app.get('server'), matchingController, queue);
    io.emit('random-match', { startMatching, handleDisconnect });
    // レスポンスを返す
    res.json({});
    console.log("post")
});

module.exports = router;