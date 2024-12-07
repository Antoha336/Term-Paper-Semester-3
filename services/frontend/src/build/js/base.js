const USER_SERVICE_URL  = '/user-service'
const EVENT_SERVICE_URL = '/event-service'

function format_date(string_date) {
    return new Intl.DateTimeFormat('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(string_date));
}

async function request(link, method, {auth_token = undefined, body = undefined, error = ''}) {
    const options = {
        method: method,
        headers: {},
    };

    if (auth_token !== undefined) {
        options.headers['Authorization'] = `Bearer ${auth_token}`;
    }
    if (body !== undefined) {
        options.body = JSON.stringify(body);
        options.headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(link, options);
    if (!response.ok) {
        throw Error(error);
    }

    return response;
}

function closeModal(modal) {
    modal.close();
}

function openModal(modal) {
    const closeButton = modal.querySelector('.modal-close-button');
    closeButton.addEventListener('click', (evt) => {
        closeModal(modal);
    });

    modal.showModal();
}
