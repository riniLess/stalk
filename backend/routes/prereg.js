const express = require('express');
const pool = require('../db');
const { sendRegistrationConfirmation } = require('../services/email');

const router = express.Router();

function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return typeof email === 'string' &&
        email.length >= 6 &&
        email.length <= 255 &&
        emailRegex.test(email);
}

// POST /api/register
router.post('/register', async (req, res) => {
    const { email, role } = req.body;

    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Некорректный email' });
    }

    if (!['client', 'seller'].includes(role)) {
        return res.status(400).json({ error: 'Некорректная роль' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    try {
        const { rows } = await pool.query(
            `INSERT INTO preregistrations (email, role)
             VALUES ($1, $2)
                 RETURNING id, created_at`,
            [normalizedEmail, role]
        );

        console.log(`✅ Регистрация #${rows[0].id}: ${normalizedEmail} как ${role}`);

        // Отправляем email подтверждение и ждём результата
        const emailResult = await sendRegistrationConfirmation(normalizedEmail, role);

        if (!emailResult.success) {
            console.warn(`⚠️ Email не отправлен на ${normalizedEmail}: ${emailResult.error}`);
        }

        res.status(201).json({
            success: true,
            id: rows[0].id,
            created_at: rows[0].created_at,
            email_sent: emailResult.success, // Сообщаем, отправлен ли email
        });

    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Email уже зарегистрирован' });
        }

        console.error('❌ DB error:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// GET /api/stats — Статистика регистраций
router.get('/stats', async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT role, COUNT(*) as count
             FROM preregistrations
             GROUP BY role`
        );

        const stats = {
            clients: 0,
            sellers: 0,
            total: 0
        };

        rows.forEach(row => {
            const count = parseInt(row.count);
            if (row.role === 'client') stats.clients = count;
            if (row.role === 'seller') stats.sellers = count;
            stats.total += count;
        });

        res.json(stats);
    } catch (err) {
        console.error('❌ DB stats error:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// GET /api/list — Список регистраций
router.get('/list', async (req, res) => {
    let limit = Number(req.query.limit ?? 50);
    let offset = Number(req.query.offset ?? 0);

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
        limit = 50;
    }

    if (!Number.isInteger(offset) || offset < 0) {
        offset = 0;
    }

    try {
        const { rows } = await pool.query(
            `SELECT id, email, role, created_at
             FROM preregistrations
             ORDER BY created_at DESC
                 LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        res.json({ count: rows.length, items: rows });
    } catch (err) {
        console.error('❌ DB list error:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router;
