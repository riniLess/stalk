const clientBtn = document.getElementById('clientBtn');
const sellerBtn = document.getElementById('sellerBtn');
const benefits = document.getElementById('benefits');
const hint = document.getElementById('hint');
const openModal = document.getElementById('openModal');

const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const registrationForm = document.getElementById('registrationForm');
const formWrapper = document.querySelector('.form'); // div с формой
const successEl = document.querySelector('.success');
const modalTitle = document.getElementById('modalTitle');
const modalSubtitle = document.getElementById('modalSubtitle');
const successText = document.getElementById('successText');

const texts = {
    client: {
        benefits: [
            'Пол и возраст собеседника подтверждены',
            'Общайся сразу без ожидания',
            'Выбери того, кто готов говорить на твою тему',
            'Деньги в безопасности',
            'Не нужно раскрывать личность',
            'Выбирай по рейтингу и отзывам',
            'Просто, как случайный попутчик'
        ],
        hint: 'Регистрируйся первым — получи бонусные минуты на баланс',
        cta: 'Присоединиться к списку первых',
        modalTitle: 'Предварительная регистрация для клиента',
        modalSubtitle: 'Будь среди первых, кто сможет общаться и получать бонусные минуты',
        modalCTA: 'Получить бонусные минуты',
        successText: 'Вы в списке первых клиентов S-Talk'
    },
    seller: {
        benefits: [
            'Клиенты приходят сами — не ищешь их',
            'Не нужно тратить деньги на рекламу',
            'Оплата за разговор автоматически',
            'Мы предупредим о продлении',
            'Видишь рейтинг клиента и black-light',
            'Можно менять тему общения',
            'Зарабатывай больше, чем на основной работе'
        ],
        hint: 'Будь среди первых и начни зарабатывать',
        cta: 'Присоединиться сейчас',
        modalTitle: 'Предварительная регистрация для собеседника',
        modalSubtitle: 'Будь первым, кто сможет зарабатывать на общении',
        modalCTA: 'Встать в очередь на заработок',
        successText: 'Вы в списке первых собеседников S-Talk'
    }
};

/**
 * Показать toast уведомление
 */
function showToast(message, type = 'info', duration = 4000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = { success: '✓', error: '✕', info: 'ℹ' };

    toast.innerHTML = `
        <span class="toast-icon">${icons[type]}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

function setRole(role) {
    const isClient = role === 'client';

    clientBtn.classList.toggle('active', isClient);
    sellerBtn.classList.toggle('active', !isClient);

    clientBtn.setAttribute('aria-selected', isClient);
    sellerBtn.setAttribute('aria-selected', !isClient);

    benefits.innerHTML = texts[role].benefits.map(b => `<li>${b}</li>`).join('');
    hint.textContent = texts[role].hint;
    openModal.textContent = texts[role].cta;
}

setRole('client');
clientBtn.addEventListener('click', () => setRole('client'));
sellerBtn.addEventListener('click', () => setRole('seller'));

// Открытие модалки
openModal.addEventListener('click', () => {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    const role = clientBtn.classList.contains('active') ? 'client' : 'seller';
    modalTitle.textContent = texts[role].modalTitle;
    modalSubtitle.textContent = texts[role].modalSubtitle;
    document.getElementById('submit').textContent = texts[role].modalCTA;
    successText.textContent = texts[role].successText;
});

// Закрытие модалки
function closeModalHandler() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    formWrapper.style.display = 'block';
    successEl.style.display = 'none';
    registrationForm.reset();

    const submitBtn = document.getElementById('submit');
    submitBtn.disabled = false;
    const role = clientBtn.classList.contains('active') ? 'client' : 'seller';
    submitBtn.textContent = texts[role].modalCTA;
}

closeModal.addEventListener('click', closeModalHandler);
modal.addEventListener('click', e => {
    if (e.target === modal) closeModalHandler();
});

// Отправка формы
registrationForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const role = clientBtn.classList.contains('active') ? 'client' : 'seller';
    const submitBtn = document.getElementById('submit');

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Валидация email до отправки
    if (!email || !emailRegex.test(email)) {
        showToast('Введите корректный email (например: user@example.com)', 'error');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, role })
        });

        const data = await response.json();

        if (response.ok) {
            // Показываем блок успеха только после успешного ответа
            formWrapper.style.display = 'none';
            successEl.style.display = 'block';

            if (data.email_sent === false) {
                showToast('Регистрация прошла, но письмо не отправлено. Проверьте настройки email.', 'info', 6000);
            }

        } else {
            showToast(data.error || 'Ошибка при регистрации', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = texts[role].modalCTA;
        }
    } catch (error) {
        showToast('Не удалось отправить запрос. Проверьте соединение.', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = texts[role].modalCTA;
    }
});
