document.addEventListener('DOMContentLoaded', function() {
    // Анимации при прокрутке
    const animateElements = document.querySelectorAll('.animate-up');
    
    const animateOnScroll = () => {
        animateElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.classList.add('show');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Инициализация при загрузке
    
    // Калькулятор
    const productSelect = document.getElementById('product');
    const quantitySlider = document.getElementById('quantity');
    const quantityValue = document.getElementById('quantityValue');
    const distanceSlider = document.getElementById('distance');
    const distanceValue = document.getElementById('distanceValue');
    
    // Результаты калькулятора
    const resultProduct = document.getElementById('resultProduct');
    const resultQuantity = document.getElementById('resultQuantity');
    const resultDistance = document.getElementById('resultDistance');
    const resultProductPrice = document.getElementById('resultProductPrice');
    const resultDeliveryPrice = document.getElementById('resultDeliveryPrice');
    const resultTotalPrice = document.getElementById('resultTotalPrice');
    
    // Форма заказа
    const orderBtn = document.getElementById('orderBtn');
    const orderForm = document.getElementById('orderForm');
    const editOrderBtn = document.getElementById('editOrder');
    const submitOrderBtn = document.getElementById('submitOrder');
    
    // Поля формы
    const formProduct = document.getElementById('formProduct');
    const formQuantity = document.getElementById('formQuantity');
    const formDistance = document.getElementById('formDistance');
    const formTotalPrice = document.getElementById('formTotalPrice');
    
    // Цены
    const productPrices = {
        standard: 1500,
        premium: 2000,
        organic: 2500
    };
    
    const productNames = {
        standard: 'Стандартный',
        premium: 'Премиум',
        organic: 'Органический с удобрениями'
    };
    
    // Обновление значений слайдеров
    quantitySlider.addEventListener('input', updateCalculator);
    distanceSlider.addEventListener('input', updateCalculator);
    productSelect.addEventListener('change', updateCalculator);
    
    function updateCalculator() {
        // Обновление отображаемых значений
        quantityValue.textContent = quantitySlider.value;
        distanceValue.textContent = distanceSlider.value;
        
        // Расчет стоимости
        const selectedProduct = productSelect.value;
        const quantity = parseInt(quantitySlider.value);
        const distance = parseInt(distanceSlider.value);
        
        const productPrice = productPrices[selectedProduct];
        const totalProductPrice = productPrice * quantity;
        
        // Расчет стоимости доставки (100 руб/км)
        const deliveryPrice = distance * 100;
        
        // Общая стоимость
        const totalPrice = totalProductPrice + deliveryPrice;
        
        // Обновление результатов
        resultProduct.textContent = productNames[selectedProduct];
        resultQuantity.textContent = quantity;
        resultDistance.textContent = distance;
        resultProductPrice.textContent = totalProductPrice;
        resultDeliveryPrice.textContent = deliveryPrice;
        resultTotalPrice.textContent = totalPrice;
        
        // Обновление формы заказа (если открыта)
        if (orderForm.classList.contains('active')) {
            formProduct.textContent = productNames[selectedProduct];
            formQuantity.textContent = quantity;
            formDistance.textContent = distance;
            formTotalPrice.textContent = totalPrice;
        }
    }
    
    // Инициализация калькулятора
    updateCalculator();
    
    // Обработка кнопки заказа
    orderBtn.addEventListener('click', function() {
        orderForm.classList.add('active');
        orderBtn.style.display = 'none';
        
        // Заполнение формы
        formProduct.textContent = productNames[productSelect.value];
        formQuantity.textContent = quantitySlider.value;
        formDistance.textContent = distanceSlider.value;
        formTotalPrice.textContent = resultTotalPrice.textContent;
        
        // Прокрутка к форме
        orderForm.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Редактирование заказа
    editOrderBtn.addEventListener('click', function() {
        orderForm.classList.remove('active');
        orderBtn.style.display = 'inline-block';
    });
    
    // Отправка заказа
    submitOrderBtn.addEventListener('click', function() {
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const date = document.getElementById('date').value;
        const comments = document.getElementById('comments').value;
        
        // Простая валидация
        if (!name || !phone || !address || !date) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }
        
        // Формирование сообщения для Telegram
        const message = `
            📦 Новый заказ чернозема:
            
            👤 Имя: ${name}
            📞 Телефон: ${phone}
            🏠 Адрес: ${address}
            📅 Дата доставки: ${date}
            
            🚜 Детали заказа:
            Тип: ${productNames[productSelect.value]}
            Количество: ${quantitySlider.value} тонн
            Расстояние: ${distanceSlider.value} км
            💰 Итого: ${resultTotalPrice.textContent} руб
            
            💬 Комментарии: ${comments || 'нет'}
        `;
        
        // Отправка в Telegram (нужно заменить YOUR_BOT_TOKEN и YOUR_CHAT_ID на реальные значения)
        const botToken = 'YOUR_BOT_TOKEN';
        const chatId = 'YOUR_CHAT_ID';
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        
        axios.post(url, {
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
        })
        .then(response => {
            alert('Ваш заказ успешно отправлен! Мы свяжемся с вами в ближайшее время.');
            // Очистка формы
            document.getElementById('name').value = '';
            document.getElementById('phone').value = '';
            document.getElementById('address').value = '';
            document.getElementById('date').value = '';
            document.getElementById('comments').value = '';
            
            // Закрытие формы
            orderForm.classList.remove('active');
            orderBtn.style.display = 'inline-block';
        })
        .catch(error => {
            console.error('Ошибка при отправке заказа:', error);
            alert('Произошла ошибка при отправке заказа. Пожалуйста, попробуйте позже или свяжитесь с нами по телефону.');
        });
    });
});


// Проверка на мобильное устройство
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Для мобильных устройств изменяем некоторые параметры
if (isMobile) {
    // Уменьшаем анимации для производительности
    document.documentElement.style.setProperty('--animate-duration', '0.5s');
    
    // Изменяем поведение слайдеров
    const sliders = document.querySelectorAll('input[type="range"]');
    sliders.forEach(slider => {
        slider.style.touchAction = 'manipulation';
    });
    
    // Оптимизация для тач-устройств
    document.querySelectorAll('.btn').forEach(btn => {
        btn.style.minWidth = '120px';
        btn.style.padding = '12px 15px';
    });
}