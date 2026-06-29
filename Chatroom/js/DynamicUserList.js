document.addEventListener("DOMContentLoaded", GetAllUserData);

const UserPanel = document.querySelector(".user-list-panel");

async function GetAllUserData() {
    try {
        const response = await fetch(`${BASE_URL}${ROUTE_NAME.GET_CHAT_USERS}`, {
            method: "GET",
            credentials: "include"
        });

        if (response.ok) {
            const UserData = await response.json();

            if (UserData.result && UserData.result.length > 0) {
                UserData.result.forEach(User => {
                    const newDiv = document.createElement("div");
                    newDiv.classList.add("user-item");
                    newDiv.setAttribute("data-userid", User._id);
                    newDiv.innerHTML = `<img src="${User.profilePic}" alt="">
                    ${User.fullName}
                    `;

                    UserPanel.appendChild(newDiv);
                });
            } else {
                // Add "no conversation" message
                const noData = document.createElement("div");
                noData.classList.add("no-conversation");
                noData.textContent = "There is no any conversation.";
                UserPanel.appendChild(noData);
            }
        }

    } catch (err) {
        console.error("Failed to load users:", err);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Server Error. Please try again later.'
        });
    }
}