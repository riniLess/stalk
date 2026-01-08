const nodemailer = require('nodemailer');

// Универсальная конфигурация через переменные окружения
const transportConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true для 465, false для других портов
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
};

const transporter = nodemailer.createTransport(transportConfig);

// Проверка подключения
transporter.verify((error, success) => {
    if (error) {
        console.error('Email сервис недоступен:', error.message);
        console.error('Проверьте настройки SMTP в .env файле');
    } else {
        console.log(`Email сервис готов (${transportConfig.host}:${transportConfig.port})`);
    }
});

/**
 * Отправка подтверждения регистрации
 */
async function sendRegistrationConfirmation(email, role) {
    const isClient = role === 'client';

    const subject = isClient
        ? '🎉 Вы в списке первых клиентов S-Talk!'
        : '💰 Вы в списке первых собеседников S-Talk!';

    // HTML шаблон
    const htmlContent = isClient ? `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <div style="background: linear-gradient(135deg, #ffb86c, #c084fc); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
                    <h1 style="color: #1a1a22; margin: 0; font-size: 32px;">S-Talk</h1>
                </div>
                
                <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <h2 style="color: #1a1a22; margin-top: 0;">Добро пожаловать! 🎉</h2>
                    
                    <p style="color: #333; line-height: 1.6; font-size: 16px;">
                        Вы успешно зарегистрировались как <strong>клиент</strong> на платформе S-Talk.
                    </p>
                    
                    <div style="background: #f5f5f7; padding: 20px; border-radius: 12px; margin: 24px 0;">
                        <p style="margin: 0 0 12px 0; color: #666; font-size: 14px; font-weight: 600;">Что вас ждёт:</p>
                        <ul style="margin: 0; padding-left: 20px; color: #333;">
                            <li style="margin-bottom: 8px;">✅ Доступ к платформе сразу после запуска</li>
                            <li style="margin-bottom: 8px;">🎁 Бонусные минуты на баланс</li>
                            <li style="margin-bottom: 8px;">🔒 Полная анонимность и безопасность</li>
                            <li style="margin-bottom: 8px;">⭐ Выбор собеседников по рейтингу</li>
                        </ul>
                    </div>
                    
                    <p style="color: #666; font-size: 14px; line-height: 1.6;">
                        Мы сообщим вам о запуске на этот email:<br>
                        <strong style="color: #ff6b35;">${email}</strong>
                    </p>
                    
                    <div style="text-align: center; margin-top: 32px;">
                        <a href="https://stalk.life" 
                           style="display: inline-block; 
                                  background: linear-gradient(135deg, #ffb86c, #c084fc); 
                                  color: #1a1a22; 
                                  padding: 14px 32px; 
                                  text-decoration: none; 
                                  border-radius: 8px;
                                  font-weight: 600;
                                  font-size: 16px;">
                            Перейти на сайт
                        </a>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0;">
                    
                    <p style="color: #999; font-size: 12px; line-height: 1.4; margin: 0;">
                        Если вы не регистрировались на S-Talk, просто проигнорируйте это письмо.<br>
                        Это письмо отправлено автоматически, отвечать на него не нужно.
                    </p>
                </div>
            </div>
        </body>
        </html>
    ` : `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <div style="background: linear-gradient(135deg, #ffb86c, #c084fc); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
                    <h1 style="color: #1a1a22; margin: 0; font-size: 32px;">S-Talk</h1>
                </div>
                
                <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <h2 style="color: #1a1a22; margin-top: 0;">Добро пожаловать! 💰</h2>
                    
                    <p style="color: #333; line-height: 1.6; font-size: 16px;">
                        Вы успешно зарегистрировались как <strong>собеседник</strong> на платформе S-Talk.
                    </p>
                    
                    <div style="background: #f5f5f7; padding: 20px; border-radius: 12px; margin: 24px 0;">
                        <p style="margin: 0 0 12px 0; color: #666; font-size: 14px; font-weight: 600;">Что вас ждёт:</p>
                        <ul style="margin: 0; padding-left: 20px; color: #333;">
                            <li style="margin-bottom: 8px;">💸 Зарабатывайте на общении</li>
                            <li style="margin-bottom: 8px;">🎯 Клиенты приходят сами</li>
                            <li style="margin-bottom: 8px;">⚡ Автоматические выплаты</li>
                            <li style="margin-bottom: 8px;">📊 Система рейтингов</li>
                        </ul>
                    </div>
                    
                    <p style="color: #666; font-size: 14px; line-height: 1.6;">
                        Мы сообщим вам о запуске на этот email:<br>
                        <strong style="color: #ff6b35;">${email}</strong>
                    </p>
                    
                    <div style="text-align: center; margin-top: 32px;">
                        <a href="https://stalk.life" 
                           style="display: inline-block; 
                                  background: linear-gradient(135deg, #ffb86c, #c084fc); 
                                  color: #1a1a22; 
                                  padding: 14px 32px; 
                                  text-decoration: none; 
                                  border-radius: 8px;
                                  font-weight: 600;
                                  font-size: 16px;">
                            Перейти на сайт
                        </a>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0;">
                    
                    <p style="color: #999; font-size: 12px; line-height: 1.4; margin: 0;">
                        Если вы не регистрировались на S-Talk, просто проигнорируйте это письмо.<br>
                        Это письмо отправлено автоматически, отвечать на него не нужно.
                    </p>
                </div>
            </div>
        </body>
        </html>
    `;

    const mailOptions = {
        from: `"S-Talk" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: subject,
        html: htmlContent,
        text: isClient
            ? `Вы зарегистрированы как клиент S-Talk. Мы сообщим о запуске на ${email}`
            : `Вы зарегистрированы как собеседник S-Talk. Мы сообщим о запуске на ${email}`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email отправлен: ${email} (ID: ${info.messageId})`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error(`❌ Ошибка отправки email на ${email}:`, error.message);
        return { success: false, error: error.message };
    }
}

module.exports = { sendRegistrationConfirmation };
