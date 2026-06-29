function sendMessage() {
    const message = messageInput.value.trim();
    if (!message || !senderId || !receiverId) {
        return;
    }

    // Construct the message object
    const messageObj = {
        senderId,
        receiverId,
        message
    };

    console.log("SENDERiD ", senderId);
    console.log("ReceiverId ", receiverId);

    // Emit to server
    socket.emit("sendMessageFromSender", messageObj);

    // Display in your own chat window (sender view)
    const senderMsg = document.createElement("div");
    senderMsg.className = "d-flex justify-content-end w-100";
    senderMsg.innerHTML = `
<div class="flex flex-col items-end gap-1 ml-auto max-w-[80%] md:max-w-[60%] w-100 mt-3">
<div class="message-gradient-sent p-3 rounded-2xl rounded-tr-none text-white shadow-xl">
<p class="text-body-md leading-relaxed m-0">${message}</p>
</div>
</div>`;
    chatArea.appendChild(senderMsg);

    messageInput.value = "";
    chatArea.scrollTop = chatArea.scrollHeight;
}