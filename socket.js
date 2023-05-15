const socketIO = require('socket.io');
const matchingController = require('./api/matching');

function initSocket(server, matchingController, queue) {
    const io = socketIO(server);

    // サーバーサイドの Socket.io の設定やイベントリスナーの定義などを行う
    // ...

    // WebSocket接続の処理
    io.on('connection', (socket) => {
        console.log('ユーザーが接続しました:', socket.id);

        // マッチングを開始するリクエストを受信したときの処理
        socket.on('startMatching', () => {
            console.log(socket)
            matchingController.startMatching(socket, queue);
        });

        // ユーザーが切断したときの処理
        socket.on('disconnect', () => {
            matchingController.handleDisconnect(socket, queue);
        });
    });
    return io;
}

module.exports = { initSocket };