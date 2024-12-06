const eventContainer       = document.querySelector('.events-container');
const eventCardTemplate    = document.querySelector('#event-card-template').content;
const eventCardBuffer      = eventCardTemplate.querySelector('.event-card')
const eventCardName        = eventCardBuffer.querySelector('.event-name');
const eventCardDate        = eventCardBuffer.querySelector('.event-date');
const eventCardLocation    = eventCardBuffer.querySelector('.event-location');

const eventModal            = document.querySelector('#event-modal');
const modalEventName        = eventModal.querySelector('.modal-event-name');
const modalEventDescription = eventModal.querySelector('.modal-event-description');
const modalEventLocation    = eventModal.querySelector('.modal-event-location');
const modalEventDate        = eventModal.querySelector('.modal-event-date');
const modalRegisterButton   = eventModal.querySelector('.modal-register-button');
const modalCloseButton      = eventModal.querySelector('.modal-close-button');

const colors = ['#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9', '#92A8D1', '#FFB347', '#D5AAFF'];


function toggleRegistrationButton(is_registered, is_available) {
    modalRegisterButton.disabled      = !is_available;
    modalRegisterButton.textContent   = is_registered ? 'Отменить регистрацию' : 'Зарегистрироваться';
}

async function registerForEvent(eventId) {
    try {
        const response = await fetch(`/event-service/events/${eventId}/register/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            alert('Произошла ошибка.');
        }

        const event = await response.json();
        toggleRegistrationButton(event.is_registered, event.is_available);
    } catch (error) {
        alert('Произошла ошибка.');
    }
}

function closeEventDetails() {
    eventModal.close();
    modalCloseButton.removeEventListener('click', closeEventDetails)
}

async function showEventDetails(eventId, eventCardElement, deleteCard) {
    const response = await fetch(`/event-service/events/${eventId}/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    const event = await response.json();

    modalEventName.textContent        = event.name;
    modalEventDescription.textContent = event.description;
    modalEventLocation.textContent    = event.location;
    modalEventDate.textContent        = format_date(event.date);
    
    modalRegisterButton.onclick = () => {
        registerForEvent(event.id);
        if (event.is_registered) {
            if (deleteCard) {
                eventCardElement.remove();
            }
            closeEventDetails();
        }
    };
    modalCloseButton.addEventListener('click', closeEventDetails);
    toggleRegistrationButton(event.is_registered, event.is_available);
    
    eventModal.showModal();
}

function renderEvents(events, deleteCard) {
    events.forEach((event, index) => {
        event.date = format_date(event.date);

        eventCardBuffer.style.backgroundColor = colors[index % colors.length]
        eventCardName.textContent             = event.name;
        eventCardLocation.textContent         = event.location;
        eventCardDate.textContent             = event.date
        
        const eventCardElement = eventCardBuffer.cloneNode(true);
        eventCardElement.addEventListener('click', () => showEventDetails(event.id, eventCardElement, deleteCard));

        eventContainer.appendChild(eventCardElement);
    });
}

async function fetchEvents(link, deleteCard) {
    try {
        const response = await fetch(link, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Ошибка получения мероприятий');
        }

        const events = await response.json();
        renderEvents(events, deleteCard);
    } catch (error) {
        console.log(error);
        eventContainer.textContent = 'Не удалось загрузить мероприятия. Пожалуйста, попоробуйте позже...';
    }
}
