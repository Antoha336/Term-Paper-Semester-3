document.addEventListener('DOMContentLoaded', async () => {
    await check_authorization();
    fetchEvents('/event-service/events/', false);
});
