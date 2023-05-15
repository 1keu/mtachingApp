const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:1234', // フロントエンドのURL
        methods: ['GET', 'POST'], // 許可するHTTPメソッド
        allowedHeaders: ['my-custom-header'], // 許可するカスタムヘッダー
        credentials: true // クッキーなどの認証情報を許可
    }
});
const cors = require('cors');
app.use(cors());
const { v4: uuidv4 } = require('uuid');
const queue = []; // マッチング待機キュー

// マッチングを開始するときの処理
function startMatching(socket) {
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

// WebSocket接続の処理
io.on('connection', (socket) => {
    console.log('ユーザーが接続しました:', socket.id);

    // マッチングを開始するリクエストを受信したときの処理
    socket.on('startMatching', () => {
        console.log(socket)
        startMatching(socket);
    });

    // ユーザーが切断したときの処理
    socket.on('disconnect', () => {
        handleDisconnect(socket);
    });
});

// 3000ポートでサーバーを起動
server.listen(3000, () => {
    console.log('サーバーがポート3000で起動しました');
});

// 通話のためのランダムなルームIDを生成する関数
function generateRoomId() {
    return uuidv4();
}
