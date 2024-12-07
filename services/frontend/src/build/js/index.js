document.addEventListener('DOMContentLoaded', async () => {
    await check_authorization();
    fetchEvents(`${EVENT_SERVICE_URL}/events/?is_available=true`, false);
});
