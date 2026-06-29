const socket = typeof io !== 'undefined' ? io(BASE_URL, { withCredentials: true }) : null;
let senderId = null;
let receiverId = null;
let payload = null;

const allUsersBtn = document.getElementById('allUsersBtn');
const userListPanel = document.getElementById('userListPanel');
const closeSlider = document.getElementById('closeSlider');
const mainContent = document.getElementById('mainContent');

let onlineUsersSet = new Set();

// Automatically check session and get logged in user's ID
window.authReady = (async () => {
    try {
        const response = await fetch(`${BASE_URL}${ROUTE_NAME.GET_PROFILE}`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            window.location.href = "../Login/Login.html";
            return null;
        }

        const data = await response.json();
        senderId = data._id;
        payload = { id: senderId };
        console.log("Authenticated as user:", senderId);
        return { senderId, payload };
    } catch (err) {
        console.error("Auth initialization failed:", err);
        window.location.href = "../Login/Login.html";
        return null;
    }
})();

function updateUserStatusInList(userId, isOnline) {
    // Update the dots in the user list sidebar
    document.querySelectorAll(`.user-item[data-userid="${userId}"] .status-dot`).forEach(dot => {
        if (isOnline) {
            dot.classList.add('online');
            dot.classList.remove('offline');
        } else {
            dot.classList.add('offline');
            dot.classList.remove('online');
        }
    });

    // Update the active chat header if this user is currently selected
    if (receiverId === userId) {
        const headerStatus = document.getElementById('chatHeaderStatus');
        if (headerStatus) {
            if (isOnline) {
                headerStatus.textContent = "Online";
                headerStatus.classList.add('text-success');
                headerStatus.classList.remove('text-secondary');
            } else {
                headerStatus.textContent = "Offline";
                headerStatus.classList.add('text-secondary');
                headerStatus.classList.remove('text-success');
            }
        }
    }
}