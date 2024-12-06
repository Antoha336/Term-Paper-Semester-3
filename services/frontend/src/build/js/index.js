const eventContainer       = document.querySelector('.events-container');
const eventCardTemplate    = document.querySelector('#event-card-template').content;
const eventCardBuffer      = eventCardTemplate.querySelector('.event-card')
const eventCardName        = eventCardBuffer.querySelector('.event-name');
const eventCardPrice       = eventCardBuffer.querySelector('.event-price span');
const eventCardDate        = eventCardBuffer.querySelector('.event-date');
const eventCardLocation    = eventCardBuffer.querySelector('.event-location');

const eventModal            = document.querySelector('#event-modal');
const modalCloseButton      = eventModal.querySelector('.modal-close-button');
const modalEventName        = eventModal.querySelector('.modal-event-name');
const modalEventDescription = eventModal.querySelector('.modal-event-description');
const modalEventPrice       = eventModal.querySelector('.modal-event-price');
const modalEventLocation    = eventModal.querySelector('.modal-event-location');
const modalEventDate        = eventModal.querySelector('.modal-event-date');
const modalRegisterButton   = eventModal.querySelector('.modal-register-button');

const logoutButton = document.querySelector('#logout-button')

const colors = ['#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9', '#92A8D1', '#FFB347', '#D5AAFF'];

async function check_auth() {
    const response = await fetch('/user-service/users/auth/', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
        logout();
        return false;
    }
    
    return true;
}

function logout() {
    localStorage.removeItem('token')
    window.location.href = "login.html";
}

function format_date(string_date) {
    return new Intl.DateTimeFormat('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(string_date));
}

function toggleRegistrationButton(is_registered) {
    modalRegisterButton.disabled      = is_registered;
    modalRegisterButton.textContent   = is_registered ? 'Вы уже зарегистрированы' : 'Зарегистрироваться';
}

function renderEvents(events) {
    events.forEach((event, index) => {
        event.date = format_date(event.date);

        eventCardBuffer.style.backgroundColor = colors[index % colors.length]
        eventCardName.textContent             = event.name;
        eventCardPrice.textContent            = event.price;
        eventCardLocation.textContent         = event.location;
        eventCardDate.textContent             = event.date
        
        const eventCardElement = eventCardBuffer.cloneNode(true);
        eventCardElement.addEventListener('click', () => showEventDetails(event.id));

        eventContainer.appendChild(eventCardElement);
    });
}

async function fetchEvents() {
    try {
        const response = await fetch('/event-service/events/');
        if (!response.ok) {
            throw new Error('Ошибка получения мероприятий');
        }

        const events = await response.json();
        renderEvents(events);
    } catch (error) {
        console.log(error);
        eventContainer.textContent = 'Не удалось загрузить мероприятия. Пожалуйста, попоробуйте позже...';
    }
}

async function registerForEvent(eventId) {
    try {
        const is_authorizes = await check_auth();
        if (!is_authorizes) {
            return
        }

        const response = await fetch(`/event-service/events/${eventId}/register/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            toggleRegistrationButton(true);
        } else {
            toggleRegistrationButton(false);
            alert('Ошибка регистрации.');
        }
    } catch (error) {
        console.log(error);
        alert('Произошла ошибка.');
    }
}

async function showEventDetails(eventId) {
    const response = await fetch(`/event-service/events/${eventId}/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    const event = await response.json();

    modalEventName.textContent        = event.name;
    modalEventDescription.textContent = event.description;
    modalEventPrice.textContent       = `${event.price} руб.`;
    modalEventLocation.textContent    = event.location;
    modalEventDate.textContent        = format_date(event.date);
    toggleRegistrationButton(event.is_registered);
    
    modalRegisterButton.onclick = () => registerForEvent(event.id);
    eventModal.showModal();
}

function closeModal() {
    eventModal.close();
}

modalCloseButton.addEventListener('click', closeModal);
logoutButton.addEventListener('click', logout);
document.addEventListener('DOMContentLoaded', fetchEvents);
