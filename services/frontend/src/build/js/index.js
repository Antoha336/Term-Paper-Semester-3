const token = localStorage.getItem('token')
if (token) {
    fetch('http://localhost:5003/users/auth/', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
    }).then(async response => {
        if (!response.ok) {
            window.location.href = "login.html";
        } else {
            return await response.json()
        }
    })
} else {
    window.location.href = "login.html";
}
