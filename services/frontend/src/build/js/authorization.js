const logoutButton = document.querySelector('#logout-button')
const token = localStorage.getItem('token')
let payload = null;

async function check_authorization() {
    const response = await fetch('/user-service/users/auth/', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
        window.location.href = "login.html";
        throw Error('Unauthorized');
    }

    const data = await response.json()
    payload = data['payload']

    return payload
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = "login.html";
}

logoutButton.addEventListener('click', logout);
