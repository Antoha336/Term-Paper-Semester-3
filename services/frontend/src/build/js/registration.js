document.forms['registration'].addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('register-name').value;
    const lastname = document.getElementById('register-lastname').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    const response = await fetch('http://localhost:5003/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, lastname, email, password })
    });

    if (response.ok) {
        alert('Регистрация успешна');
        window.location.href = "login.html";
    } else {
        alert('Ошибка регистрации');
    }
});