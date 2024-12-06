const token = localStorage.getItem('token')
payload = fetch('/user-service/users/auth/', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
}).then(response => {
    if (!response.ok) {
        window.location.href = "login.html";
    } else {
        return response.json()
    }
}).then(data => data[payload])
