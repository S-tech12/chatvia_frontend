socket.on("connect", async () => {
    // Wait for authentication initialization to complete
    await window.authReady;

    if (!senderId) {
        console.error("No authenticated user found.");
        swal.fire({
            title: "Error",
            text: "You are not logged in. Please log in to continue.",
            icon: "error",
            confirmButtonText: "OK"
        }).then(() => {
            window.location.href = "../Login/Login.html";
        });
    } else {
        try {
            // Register userId to the server
            socket.emit("register", senderId);
        } catch (err) {
            console.error("Failed to register user socket:", err);
        }
    }
});

socket.on("onlineUsersList", (users) => {
    onlineUsersSet = new Set(users);
    // Update all users currently rendered
    onlineUsersSet.forEach(userId => {
        updateUserStatusInList(userId, true);
    });
});

socket.on("userOnline", (userId) => {
    onlineUsersSet.add(userId);
    updateUserStatusInList(userId, true);
});

socket.on("userOffline", (userId) => {
    onlineUsersSet.delete(userId);
    updateUserStatusInList(userId, false);
});