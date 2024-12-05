const token = localStorage.getItem('token')
fetch('/user-service/users/auth/', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
}).then(async response => {
    if (!response.ok) {
        window.location.href = "login.html";
    } else {
        return await response.json()
    }
})
