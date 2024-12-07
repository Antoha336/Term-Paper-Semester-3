const profileInfoForm       = document.forms['profile'];
const profileInfoEmail      = profileInfoForm.email;
const profileInfoName       = profileInfoForm.name;
const profileInfoLastname   = profileInfoForm.lastname;


function fetchUserInfo() {
    profileInfoEmail.value    = payload['email'];
    profileInfoName.value     = payload['name'];
    profileInfoLastname.value = payload['lastname'];
}


document.addEventListener('DOMContentLoaded', async () => {
    await check_authorization();
    fetchUserInfo();
    fetchEvents(`${EVENT_SERVICE_URL}/events/me/`, true);
});

