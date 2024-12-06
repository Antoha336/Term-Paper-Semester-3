const eventContainer             = document.querySelector('.event-table');
const eventCardTemplate          = document.querySelector('#event-row-template').content;
const eventCardBuffer            = eventCardTemplate.querySelector('.event-row')
const eventCardName              = eventCardBuffer.querySelector('#name');
const eventCardDescription       = eventCardBuffer.querySelector('#description');
const eventCardDate              = eventCardBuffer.querySelector('#date');
const eventCardLocation          = eventCardBuffer.querySelector('#location');
const eventCardStatus            = eventCardBuffer.querySelector('#status');


async function fetchEvents() {
    const response = await fetch('/event-service/events/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw Error('Unable to fetch events');
    }

    const events = await response.json();
    renderEvents(events);
}

function renderEvents(events) {
    events.forEach((event) => {
        const eventCardElement = createEventRow(event);
        eventContainer.appendChild(eventCardElement);
    });
}

function createEventRow(event) {
    eventCardName.textContent        = event.name;
    eventCardDescription.textContent = event.description;
    eventCardDate.textContent        = format_date(event.date);
    eventCardLocation.textContent    = event.location;
    eventCardStatus.textContent      = event.is_available ? 'Открыто для регистрации' : 'Закрыто для регистрации';  

    const eventCardElement = eventCardBuffer.cloneNode(true);
    const eventCardRegistrationButton = eventCardElement.querySelector('.toggle-registration');
    const eventCardEditButton = eventCardElement.querySelector('.edit');
    const eventCardDeleteButton = eventCardElement.querySelector('.delete');

    eventCardRegistrationButton.textContent = event.is_available ? 'Открыть регистрацию' : 'Закрыть регистрацию';
    eventCardRegistrationButton.addEventListener('click', () => console.log(123));
    eventCardEditButton.addEventListener('click', () => console.log(123));
    eventCardDeleteButton.addEventListener('click', () => console.log(123));

    return eventCardElement;
}

document.addEventListener('DOMContentLoaded', async () => {
    await check_admin_rights();
    fetchEvents();
})
