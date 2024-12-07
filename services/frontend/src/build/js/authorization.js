const logoutButton = document.querySelector('#logout-button')
const token = localStorage.getItem('token')
let payload = null;

async function check_authorization() {
    const response = await fetch('/user-service/users/auth/', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
        window.location.href = "login";
        throw Error('Unauthenticated');
    }

    const data = await response.json()
    payload = data['payload']

    return payload
}

async function check_admin_rights() {
    await check_authorization();
    if (!payload['is_admin']) {
        throw Error('Unauthorized');
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = "login";
}

logoutButton.addEventListener('click', logout);
