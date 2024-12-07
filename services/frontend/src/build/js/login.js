const token = localStorage.getItem('token')
fetch('/user-service/users/auth/', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
}).then(async response => {
    if (response.ok) {
        window.location.href = "index";
    }
})

document.forms['login'].addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch('/user-service/users/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        window.location.href = "index";
    } else {
        alert('Неправильная почта или пароль');
    }
});
