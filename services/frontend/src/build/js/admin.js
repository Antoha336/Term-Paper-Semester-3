const eventContainer       = document.querySelector('.event-table');
const eventCardTemplate    = document.querySelector('#event-row-template').content;
const eventCardBuffer      = eventCardTemplate.querySelector('.event-row')
const eventCardName        = eventCardBuffer.querySelector('#name');
const eventCardDescription = eventCardBuffer.querySelector('#description');
const eventCardDate        = eventCardBuffer.querySelector('#date');
const eventCardLocation    = eventCardBuffer.querySelector('#location');
const eventCardStatus      = eventCardBuffer.querySelector('#status');

const createEventButton         = document.querySelector('.create-event-button');

const eventModalForm            = document.forms['event'];
const eventModalFormName        = eventModalForm.name;
const eventModalFormDescription = eventModalForm.description;
const eventModalFormDate        = eventModalForm.date;
const eventModalFormLocation    = eventModalForm.location;
const eventModalFormStatus      = eventModalForm.is_available;
const eventModalFormSubmit      = eventModalForm.querySelector('.form-submit-button');

const eventModal                = document.querySelector('.event-modal');
const eventModalCloseButton     = eventModal.querySelector('.modal-close-button');
const eventModalHeader          = eventModal.querySelector('h2');



function createEventRow(event) {
    eventCardName.textContent        = event.name;
    eventCardDescription.textContent = event.description;
    eventCardDate.textContent        = format_date(event.date);
    eventCardLocation.textContent    = event.location;
    eventCardStatus.textContent      = event.is_available ? 'Открыто для регистрации' : 'Закрыто для регистрации';  

    const eventCardElement = eventCardBuffer.cloneNode(true);
    const eventCardEditButton = eventCardElement.querySelector('.edit');
    const eventCardDeleteButton = eventCardElement.querySelector('.delete');
    
    eventCardEditButton.addEventListener('click', () => {
        openEditEventModal(event);
    });
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

async function handleCreateEventForm() {
    data = {
        name:        eventModalFormName.value,
        description: eventModalFormDescription.value,
        date:        eventModalFormDate.value,
        location:    eventModalFormLocation.value,
        is_available: eventModalFormStatus.value,
    }

    const newEvent = await createEvent(data);
    const newEventElement = createEventRow(newEvent);

    eventContainer.appendChild(newEventElement);
}

async function handleEditEventForm(eventId) {
    data = {
        name:         eventModalFormName.value,
        description:  eventModalFormDescription.value,
        date:         eventModalFormDate.value,
        location:     eventModalFormLocation.value,
        is_available: eventModalFormStatus.value,
    }

    await editEvent(eventId, data);
}

async function refetchEvents() {
    const headerRow = eventContainer.firstElementChild
    eventContainer.replaceChildren(headerRow);

    await fetchEvents();
}

async function fetchEvents() {
    const response = await request('/event-service/events/', 'GET', {
        auth_token: token,
        error: 'Unable to fetch events',
    });
    const events = await response.json();

    renderEvents(events);
}

async function createEvent(data) {
    const response = await request(`/event-service/events/`, 'POST', {
        auth_token: token,
        body: JSON.stringify(data),
    });
    const newEvent = await response.json();

    return newEvent;
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

async function createEventListener(evt) {
    evt.preventDefault();
    closeModal(eventModal);
    await handleCreateEventForm();
}

function openCreateEventModal() {
    eventModalHeader.textContent     = 'Создать мероприятие';
    eventModalFormSubmit.textContent = 'Создать';

    eventModalForm.removeEventListener('submit', editEventListener);
    eventModalForm.addEventListener('submit', createEventListener);

    eventModalForm.reset();

    openModal(eventModal);  
}

async function editEventListener(evt) {
    evt.preventDefault();
    closeModal(eventModal);
    await handleEditEventForm(evt.target.id);

    await refetchEvents();
}

function openEditEventModal(event) {
    eventModalForm.id = event.id;
    eventModalHeader.textContent     = 'Изменить мероприятие';
    eventModalFormSubmit.textContent = 'Сохранить';

    eventModalForm.removeEventListener('submit', createEventListener);
    eventModalForm.addEventListener('submit', editEventListener);

    eventModalFormName.value         = event.name;
    eventModalFormDescription.value  = event.description;
    eventModalFormDate.value         = event.date;
    eventModalFormLocation.value     = event.location;
    eventModalFormStatus.value       = event.is_available;
    
    openModal(eventModal);
}

document.addEventListener('DOMContentLoaded', async () => {
    await check_admin_rights();
    fetchEvents();
})

createEventButton.addEventListener('click', openCreateEventModal);
