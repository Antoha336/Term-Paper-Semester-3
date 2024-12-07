const eventContainer             = document.querySelector('.event-table');
const eventCardTemplate          = document.querySelector('#event-row-template').content;
const eventCardBuffer            = eventCardTemplate.querySelector('.event-row')
const eventCardName              = eventCardBuffer.querySelector('#name');
const eventCardDescription       = eventCardBuffer.querySelector('#description');
const eventCardDate              = eventCardBuffer.querySelector('#date');
const eventCardLocation          = eventCardBuffer.querySelector('#location');
const eventCardStatus            = eventCardBuffer.querySelector('#status');


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

    eventCardRegistrationButton.textContent = !event.is_available ? 'Открыть регистрацию' : 'Закрыть регистрацию';
    eventCardRegistrationButton.addEventListener('click', async (evt) => {
        const newEvent = await editEvent(event.id, {is_available: !event.is_available});
        const eventElement = evt.target.closest('.event-row')
        eventElement.querySelector('#status').textContent = newEvent.is_available  ? 'Открыто для регистрации' : 'Закрыто для регистрации';          
        evt.target.textContent                            = !newEvent.is_available ? 'Открыть регистрацию'     : 'Закрыть регистрацию';
    });
    eventCardEditButton.addEventListener('click', () => console.log(123));
    eventCardDeleteButton.addEventListener('click', async () => {
        await deleteEvent(event.id);
        eventCardElement.remove();
    });

    return eventCardElement;
}

function renderEvents(events) {
    events.forEach((event) => {
        const eventCardElement = createEventRow(event);
        eventContainer.appendChild(eventCardElement);
    });
}

async function fetchEvents() {
    const response = await request('/event-service/events/', 'GET', {
        auth_token: token,
        error: 'Unable to fetch events',
    });
    const events = await response.json();

    renderEvents(events);
}

async function editEvent(eventId, data) {
    const response = await request(`/event-service/events/${eventId}/`, 'PATCH', {
        auth_token: token,
        body: JSON.stringify(data),
    });
    const newEvent = await response.json();

    return newEvent;
}

async function deleteEvent(eventId) {
    await request(`/event-service/events/${eventId}/`, 'DELETE', {
        auth_token: token,
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await check_admin_rights();
    fetchEvents();
})
