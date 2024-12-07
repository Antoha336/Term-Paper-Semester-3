const token = localStorage.getItem('token')
fetch(`${USER_SERVICE_URL}/users/auth/`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
}).then(async response => {
    if (response.ok) {
        window.location.href = "index";
    }
})

document.forms['registration'].addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('register-name').value;
    const lastname = document.getElementById('register-lastname').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    const response = await fetch(`${USER_SERVICE_URL}/users/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, lastname, email, password })
    });

    if (response.ok) {
        alert('Регистрация успешна');
        window.location.href = "login";
    } else {
        alert('Ошибка регистрации');
    }
});