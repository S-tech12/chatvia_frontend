document.addEventListener('DOMContentLoaded', () => {
    const redirectMessage = document.getElementById('redirectMessage');
    let countdown = 3;

    const interval = setInterval(async () => {
        countdown--;
        if (countdown > 0) {
            if (redirectMessage) {
                redirectMessage.innerText = `Redirecting to chatroom in ${countdown} seconds...`;
            }
        } else {
            clearInterval(interval);

            try {
                const response = await fetch(`${BASE_URL}${ROUTE_NAME.VERIFY_TOKEN}`, {
                    method: 'GET',
                    credentials: 'include'
                });

                if (!response.ok) {
                    window.location.href = 'Login/Login.html';
                } else {
                    window.location.href = 'Chatroom/Chatroom.html';
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
                window.location.href = 'Login/Login.html';
            }
        }
    }, 1000);
});