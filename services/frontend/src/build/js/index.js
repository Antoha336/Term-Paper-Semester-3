const eventContainer       = document.querySelector('.events-container');
const eventCardTemplate    = document.querySelector('#event-card-template').content;
const eventCardBuffer      = eventCardTemplate.querySelector('.event-card')
const eventCardName        = eventCardBuffer.querySelector('.event-name');
const eventCardPrice       = eventCardBuffer.querySelector('.event-price span');
const eventCardDate        = eventCardBuffer.querySelector('.event-date');
const eventCardLocation    = eventCardBuffer.querySelector('.event-location');

const logoutButton         = document.querySelector('#logout-button')

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
        console.log(error);
        alert('Произошла ошибка.');
    }
}

function renderEvents(events) {
    events.forEach((event, index) => {
        eventCardBuffer.style.backgroundColor = colors[index % colors.length]
        eventCardName.textContent             = event.name;
        eventCardPrice.textContent            = event.price;
        eventCardLocation.textContent         = event.location;
        eventCardDate.textContent             = new Intl.DateTimeFormat('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(event.date));
        
        const eventCardElement = eventCardBuffer.cloneNode(true);

        eventContainer.appendChild(eventCardElement);
    });
}

logoutButton.addEventListener('click', logout);
document.addEventListener('DOMContentLoaded', fetchEvents);
