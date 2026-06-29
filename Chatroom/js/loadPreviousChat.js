async function loadChatHistory(receiverId) {
    try {
        const response = await fetch(`${BASE_URL}${ROUTE_NAME.GET_CHAT_HISTORY}/${receiverId}`, {
            method: "GET",
            credentials: "include"
        });

        if (response.ok) {
            const { messages } = await response.json();
            const chatArea = document.getElementById("chatArea");

            if (messages.length > 0) {
                chatArea.innerHTML = ""; // Clear the 'Say hello...' message
                messages.forEach(msg => {
                    const messageObj = {
                        senderId: msg.sender,
                        receiverId: msg.receiver,
                        content: msg.messageType === "text" ? msg.content : "",   // only for text
                        fileUrl: msg.messageType !== "text" ? msg.content : "",   // only for files
                        Filetype: msg.messageType,  // "text" | "image" | "video" | "pdf" | "docx"
                        originalName: msg.originalName || null,
                        fileSizeKB: msg.fileSizeKB || null
                    };

                    const isSender = (msg.sender === payload.id);

                    // Route based on type
                    if (msg.messageType === "docx") {
                        renderMessageBubbleForDocx(messageObj, isSender);
                    } else if (msg.messageType === "pdf") {
                        renderMessageBubbleForPdf(messageObj, isSender);
                    } else if (msg.messageType === "text") {
                        const messageDiv = document.createElement("div");

                        if (msg.sender === payload.id) {
                            messageDiv.className = "d-flex justify-content-end w-100";
                            messageDiv.innerHTML = `
<div class="flex flex-col items-end gap-1 ml-auto max-w-[80%] md:max-w-[60%] w-100 mt-3">
<div class="message-gradient-sent p-3 rounded-2xl rounded-tr-none text-white shadow-xl">
<p class="text-body-md leading-relaxed m-0">${msg.content}</p>
</div>
</div>`;
                        } else {
                            messageDiv.className = "d-flex justify-content-start w-100";
                            messageDiv.innerHTML = `
<div class="flex flex-col items-start gap-1 max-w-[80%] md:max-w-[60%] w-100 mt-3">
<div class="bg-surface-variant/40 backdrop-blur-2xl glass-border p-3 rounded-2xl rounded-tl-none shadow-xl">
<p class="text-body-md text-on-surface leading-relaxed m-0">${msg.content}</p>
</div>
</div>`;
                        }

                        chatArea.appendChild(messageDiv);
                    } else if (msg.messageType === "image" || msg.messageType === "video") {
                        renderMessageBubble(messageObj, isSender);
                    }
                });

                scrollToBottom();
            }
        }
    } catch (error) {
        console.error("Failed to load chat history:", error);
    }
}



// old code
/*async function loadChatHistory(receiverId) {
    try {
        const response = await fetch(`${BASE_URL}${ROUTE_NAME.GET_CHAT_HISTORY}/${receiverId}`, {
            method: "GET",
            headers: {
                'authorization': `Bearer ${token}`,
            }
        });

        if (response.ok) {
            const { messages } = await response.json();
            const chatArea = document.getElementById("chatArea");

            if(messages.length > 0 ){

                messages.forEach(msg => {
                    const messageDiv = document.createElement("div");
                    
                    if (msg.sender === payload.id) {
                        // Sender's message styling
                        messageDiv.className = "d-flex justify-content-end";
                        messageDiv.innerHTML = `<div class="message-bubble message-sent">${msg.content}</div>`;
                    } else {
                        // Receiver's message styling
                        messageDiv.className = "d-flex justify-content-start";
                        messageDiv.innerHTML = `<div class="message-bubble message-received">${msg.content}</div>`;
                    }
                    
                    chatArea.appendChild(messageDiv);
                });
                
                chatArea.scrollTop = chatArea.scrollHeight;
            }else{
                mainContent.innerHTML = `
                    <div class="d-flex flex-column justify-content-between w-100 h-100">
                    <!-- Top bar with username -->
                    <div class="d-flex align-items-center p-3 border-bottom border-secondary" style="background-color: #111;">
                        <img src="${profilePic}" alt="" class="rounded-circle me-2" width="40" height="40">
                        <h5 class="mb-0 text-white">${username}</h5>
                    </div>
                    <!-- Chat messages area -->
                    <div class="flex-grow-1 p-3 overflow-auto d-flex flex-column gap-2" style="background-color: #000;" id="chatArea">
                        <p class="text-center fw-bold" style="color: #888;">Say hello to start your conversation with ${username} 👋</p>
                    </div>
                    
                    <!-- Input area -->
                    <div class="d-flex align-items-center p-2 border-top border-secondary" style="background-color: #111;">
                        <input id="messageInput" type="text" class="form-control bg-dark text-white border-0 me-2" placeholder="Type a message...">
                        <button id="sendBtn" class="btn btn-success me-2"><i class="bi bi-send-fill"></i></button>
                        <i class="bi bi-mic-fill text-white fs-4"></i>
                    </div>
                 </div>
                `
            }
        }
    } catch (error) {
        console.error("Failed to load chat history:", error);
    }
}*/