socket.on("receiveMessage", ({ senderId: msgSenderId, message }) => {
    const chatArea = document.getElementById("chatArea");
    if (!chatArea || msgSenderId !== receiverId) return;

    const receiverMsg = document.createElement("div");
    receiverMsg.className = "d-flex justify-content-start w-100";
    receiverMsg.innerHTML = `
<div class="flex flex-col items-start gap-1 max-w-[80%] md:max-w-[60%] w-100 mt-3">
<div class="bg-surface-variant/40 backdrop-blur-2xl glass-border p-3 rounded-2xl rounded-tl-none shadow-xl">
<p class="text-body-md text-on-surface leading-relaxed m-0">${message}</p>
</div>
</div>`;
    chatArea.appendChild(receiverMsg);
    chatArea.scrollTop = chatArea.scrollHeight;
});


socket.on("receiveImageVideo", (messageObj) => {
    renderMessageBubble(messageObj, false);
});

function renderMessageBubble(messageObj, isSender = false) {
    const bubble = document.createElement("div");
    bubble.className = `d-flex ${isSender ? "justify-content-end" : "justify-content-start"}`;

    let innerContent = "";

    if (messageObj.Filetype === "image") {
        innerContent = `
            <div class="message-bubble ${isSender ? "message-sent" : "message-received"}">
                <img src="${messageObj.fileUrl}" alt="image" 
                     class="chat-img"
                     style="max-width:400px; border-radius: 10px; cursor: pointer;" 
                     onclick="openImageModal('${messageObj.fileUrl}')"     
                />
            </div>`;
    } else if (messageObj.Filetype === "video") {
        innerContent = `
            <div class="message-bubble ${isSender ? "message-sent" : "message-received"} position-relative"
             style="display:inline-block; cursor:pointer;" 
             onclick="openVideoModal('${messageObj.fileUrl}')">
            
            <!-- Thumbnail frame -->
            <video src="${messageObj.fileUrl}" muted playsinline preload="metadata"
                   style="max-width:400px; border-radius:10px; pointer-events:none;"></video>

            <!-- Play button overlay -->
            <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); font-size:3rem; color:deeppink; opacity:0.9;">
                <i class="bi bi-play-circle-fill"></i>
            </div>
        </div>`;
    }

    bubble.innerHTML = innerContent;
    chatArea.appendChild(bubble);
    chatArea.scrollTop = chatArea.scrollHeight;
}

socket.on("receiveDocx", (messageObj) => {
    renderMessageBubbleForDocx(messageObj, false);
});


function renderMessageBubbleForDocx(messageObj, isSender = false) {
    const bubble = document.createElement("div");
    bubble.className = `d-flex ${isSender ? "justify-content-end" : "justify-content-start"} mb-2`;

    const originalName = messageObj.originalName || messageObj.fileUrl.split("/").pop();
    const fileSize = messageObj.fileSizeKB ? `${messageObj.fileSizeKB} KB` : "";

    let innerContent = "";

    // Common card style (both sender & receiver)
    const cardStyle = `
        border:1px solid #2f2f2f; 
        border-radius:12px; 
        background:${isSender ? "#1c1c1c" : "#111827"}; 
        max-width:20rem; 
        min-height:6rem;
    `;

    innerContent = `
        <div class="message-bubble ${isSender ? "message-sent" : "message-received"} 
                    d-flex align-items-center p-3 shadow-sm" 
             style="${cardStyle}">
            
            <!-- Word Icon -->
            <i class="bi bi-file-earmark-word-fill text-primary fs-2 me-3"></i>
            
            <!-- File Info -->
            <div class="d-flex flex-column flex-grow-1">
                <span class="fw-bold text-truncate text-white" 
                      title="${originalName}" style="max-width:200px;">
                    ${originalName}
                </span>
                <small class="text-white-50">${fileSize} Microsoft Word Document</small>
                
                ${!isSender ? `
                    <button onclick="downloadChatFile('${messageObj.fileUrl}', '${originalName}')" 
                       class="btn btn-sm btn-success mt-2 align-self-start px-3 py-1 rounded-pill">
                        Download
                    </button>` : ""}
            </div>
        </div>
    `;

    bubble.innerHTML = innerContent;
    chatArea.appendChild(bubble);
    chatArea.scrollTop = chatArea.scrollHeight;
}

socket.on("receivePdf", (messageObj) => {
    renderMessageBubbleForPdf(messageObj, false);
});

function renderMessageBubbleForPdf(messageObj, isSender = false) {
    const bubble = document.createElement("div");
    bubble.className = `d-flex ${isSender ? "justify-content-end" : "justify-content-start"} mb-2`;

    const originalName = messageObj.originalName || messageObj.fileUrl.split("/").pop();
    const fileSize = messageObj.fileSizeKB ? `${messageObj.fileSizeKB} KB` : "";

    // PDF card style
    const cardStyle = `
        border:1px solid #dc3545; 
        border-radius:14px; 
        background:${isSender ? "#2a0000" : "#1a1a1a"}; 
        max-width:20rem; 
        min-height:6rem;
    `;

    const innerContent = `
        <div class="message-bubble ${isSender ? "message-sent" : "message-received"} 
                    d-flex align-items-center p-3 shadow-sm" 
             style="${cardStyle}">
            
            <!-- PDF Icon -->
            <i class="bi bi-file-earmark-pdf-fill text-danger fs-2 me-3"></i>
            
            <!-- File Info -->
            <div class="d-flex flex-column flex-grow-1">
                <span class="fw-bold text-truncate text-white" 
                      title="${originalName}" style="max-width:200px;">
                    ${originalName}
                </span>
                <small class="text-white-50">${fileSize} PDF Document</small>
                
                ${!isSender ? `
                    <button onclick="downloadChatFile('${messageObj.fileUrl}', '${originalName}')" 
                       class="btn btn-sm btn-danger mt-2 align-self-start px-3 py-1 rounded-pill">
                        Download
                    </button>` : ""}
            </div>
        </div>
    `;

    bubble.innerHTML = innerContent;
    chatArea.appendChild(bubble);
    chatArea.scrollTop = chatArea.scrollHeight;
}

// Global function to force download of cross-origin files like from Cloudinary
window.downloadChatFile = function (url, fileName) {
    // Cloudinary raw files don't support fl_attachment via URL transformation.
    // They usually download natively or open in a new tab safely.
    if (url.includes('cloudinary.com') && url.includes('/raw/upload/')) {
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
    }

    // For Cloudinary images/videos, we can force download via fl_attachment
    if (url.includes('cloudinary.com') && url.includes('/upload/')) {
        url = url.replace('/upload/', '/upload/fl_attachment/');
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
    }

    // Fallback: fetch blob
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.blob();
        })
        .then(blob => {
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
        })
        .catch(err => {
            console.error("Download failed", err);
            window.open(url, '_blank');
        });
}