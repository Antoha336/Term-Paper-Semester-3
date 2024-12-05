const eventContainer       = document.querySelector('#events-container');
const eventCardTemplate    = document.querySelector('#event-card-template').content;
const eventCardBuffer      = eventCardTemplate.querySelector('.event-card')
const eventCardName        = eventCardBuffer.querySelector('.event-name');
const eventCardDescription = eventCardBuffer.querySelector('.event-description');
const eventCardLocation    = eventCardBuffer.querySelector('.event-location span');
const eventCardStatus      = eventCardBuffer.querySelector('.event-status span');
const eventCardDate        = eventCardBuffer.querySelector('.event-date span');

const logoutButton         = document.querySelector('.logout-button')


const eventStatuses = {
    'registration_started': 'Регистрация открыта',
    'registration_ended':   'Регистрация закрыта',
    'event_started':        'Мероприятие началось',
    'event_ended':          'Мероприятие закончилось',
}


async function check_auth() {
    const response = await fetch('/user-service/users/auth/', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
        window.location.href = "login.html";
        return false;
    } else {
        return await response.json()
    }
}

function logout() {
    localStorage.removeItem('token')
    window.location.href = "login.html";
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
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (response.ok) {
            alert('Успешная регистрация!');
        } else {
            alert('Ошибка регистрации.');
        }
    } catch (error) {
        alert('Произошла ошибка.');
    }
}

function renderEvents(events) {
    events.forEach(event => {
        eventCardName.textContent        = event.name;
        eventCardDescription.textContent = event.description;
        eventCardLocation.textContent    = event.location;
        eventCardStatus.textContent      = eventStatuses[event.status];
        eventCardDate.textContent        = event.date;
        
        const eventCardElement = eventCardBuffer.cloneNode(true);
        eventCardElement.querySelector('.event-register-button').addEventListener('click', () => {
            registerForEvent(event.id)
        })

        eventContainer.appendChild(eventCardElement);
    });
}

logoutButton.addEventListener('click', logout);
document.addEventListener('DOMContentLoaded', fetchEvents);
