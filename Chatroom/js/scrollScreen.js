function scrollToBottom() {
    const chatArea = document.getElementById("chatArea");
    if (!chatArea) return;

    // Wait for DOM update
    setTimeout(() => {
        chatArea.scrollTop = chatArea.scrollHeight;
    }, 100);
}