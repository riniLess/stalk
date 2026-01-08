-- Создание таблицы для предрегистрации

CREATE TABLE IF NOT EXISTS preregistrations (
                                                id SERIAL PRIMARY KEY,
                                                email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(10) NOT NULL CHECK (role IN ('client', 'seller')),
    created_at TIMESTAMP DEFAULT NOW(),

    -- Ограничение: email должен быть в нижнем регистре
    CONSTRAINT email_lowercase CHECK (email = LOWER(email))
    );

-- Индексы для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_email ON preregistrations(email);
CREATE INDEX IF NOT EXISTS idx_role ON preregistrations(role);
CREATE INDEX IF NOT EXISTS idx_created_at ON preregistrations(created_at DESC);

-- Комментарии к таблице
COMMENT ON TABLE preregistrations IS 'Предварительная регистрация пользователей на лендинге';
COMMENT ON COLUMN preregistrations.id IS 'Уникальный идентификатор';
COMMENT ON COLUMN preregistrations.email IS 'Email пользователя (уникальный, lowercase)';
COMMENT ON COLUMN preregistrations.role IS 'Роль пользователя: client (клиент) или seller (собеседник)';
COMMENT ON COLUMN preregistrations.created_at IS 'Дата и время регистрации';

-- Вывод информации об успешной инициализации
DO $$
BEGIN
    RAISE NOTICE 'База данных stalk_landing успешно инициализирована!';
    RAISE NOTICE 'Таблица preregistrations создана';
    RAISE NOTICE 'Индексы установлены';
END $$;
