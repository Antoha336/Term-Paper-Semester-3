const token = localStorage.getItem('token');

document.getElementById('create-event-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('event-title').value;
    const description = document.getElementById('event-description').value;
    const date = document.getElementById('event-date').value;

    const response = await fetch('http://localhost:5001/api/events', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, date })
    });

    if (response.ok) {
        alert('Event created successfully');
    } else {
        alert('Failed to create event');
    }
});

// Load events and render them
