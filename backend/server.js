// backend/server.js
const express = require('express');
const preregRoutes = require('./routes/prereg');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10kb' }));

// CORS для локальной разработки
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        if (req.method === 'OPTIONS') return res.sendStatus(200);
        next();
    });
}

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});

// API роуты
app.use('/api', preregRoutes);

// 404 для остальных маршрутов
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Запуск сервера
app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('S-Talk Backend запущен');
    console.log(`Порт: ${PORT}`);
    console.log(`Окружение: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Health: http://localhost:${PORT}/health`);
    console.log(`Stats: http://localhost:${PORT}/api/stats`);
    console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM — завершаю работу...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT — завершаю работу...');
    process.exit(0);
});
