const token = localStorage.getItem('token');

async function loadEvents() {
    const response = await fetch('http://localhost:5001/api/events', {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
        const events = await response.json();
        const eventsList = document.getElementById('events-list');
        eventsList.innerHTML = events.map(event => `
            <div>
                <h3>${event.title}</h3>
                <p>${event.description}</p>
                <button onclick="registerEvent('${event.id}')">Register</button>
            </div>
        `).join('');
    } else {
        alert('Failed to load events');
    }
}

async function registerEvent(eventId) {
    const response = await fetch(`http://localhost:5001/api/events/${eventId}/register`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
        alert('Registered successfully');
    } else {
        alert('Registration failed');
    }
}

loadEvents();
