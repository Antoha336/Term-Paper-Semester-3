document.addEventListener('DOMContentLoaded', async () => {
    await check_authorization();
    fetchEvents('/event-service/events/?is_available=true', false);
});
