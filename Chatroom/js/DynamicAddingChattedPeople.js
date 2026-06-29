// Open user list slider
userListBtn.addEventListener('click', () => {
    AddChattedPeople();
    document.getElementById('secondarySlider').classList.remove('hidden');
    document.getElementById('secondarySlider').classList.add('flex');
});

// Close slider
closeSlider.addEventListener('click', () => {
    document.getElementById('secondarySlider').classList.add('hidden');
    document.getElementById('secondarySlider').classList.remove('flex');
});

async function AddChattedPeople() {
    try {
        const response = await fetch(`${BASE_URL}${ROUTE_NAME.GET_CHAT_USERS}`, {
            method: "GET",
            credentials: "include"
        });

        if (response.ok) {
            const UserData = await response.json();

            // ⚠️ Clear old content and re-add close button + header
            userListPanel.innerHTML = `
                <!-- Desktop Header: Hidden on mobile -->
                <div class="hidden md:block">
                    <div class="close-slider" id="closeSlider">
                        <i class="bi bi-chevron-left"></i>
                    </div>
                    <h4 class="mb-3">Messages</h4>
                </div>
                
                <!-- Mobile Back Button -->
                <div class="md:hidden flex items-center p-4 border-b border-outline-variant/20 mb-4 cursor-pointer text-primary close-mobile-btn">
                    <span class="material-symbols-outlined">arrow_back</span>
                    <span class="ml-2 font-label-bold">Back</span>
                </div>
            `;


            if (UserData.result && UserData.result.length > 0) {
                mainContent.innerHTML = "";
                UserData.result.forEach(User => {
                    const ProfileImage = User.profilePic && User.profilePic.trim() !== "" ? User.profilePic : "../ProfileSetup/Default_Image.jpg";

                    const isOnline = onlineUsersSet.has(User._id);
                    const statusClass = isOnline ? 'online' : 'offline';

                    const newDiv = document.createElement("div");
                    newDiv.classList.add("user-item");
                    newDiv.setAttribute("data-userid", User._id);
                    newDiv.setAttribute("data-profilepic", User.profilePic);
                    newDiv.innerHTML = `<div style="position: relative; display: inline-block;">
                        <img src="${ProfileImage}" alt="">
                        <div class="status-dot ${statusClass}"></div>
                    </div>
                    ${User.fullName}
                    `;

                    userListPanel.appendChild(newDiv);
                });

                SelectedWithChat();
            } else {
                // Add "no conversation" message
                const noData = document.createElement("div");
                noData.classList.add("no-conversation");
                noData.textContent = "There is no any conversation.";
                userListPanel.appendChild(noData);
            }

            // ⚠️ Re-attach close button event because we recreated it
            const closeBtnDesktop = document.getElementById("closeSlider");
            if (closeBtnDesktop) {
                closeBtnDesktop.addEventListener('click', () => {
                    document.getElementById('secondarySlider').classList.add('hidden');
                    document.getElementById('secondarySlider').classList.remove('flex');
                });
            }

            const closeBtnMobile = document.querySelector(".close-mobile-btn");
            if (closeBtnMobile) {
                closeBtnMobile.addEventListener('click', () => {
                    document.getElementById('secondarySlider').classList.add('hidden');
                    document.getElementById('secondarySlider').classList.remove('flex');
                });
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

function SelectedWithChat() {
    // Handle user clicks to open chat view
    document.querySelectorAll('.user-item').forEach(item => {
        item.addEventListener('click', () => {
            // this will get the receiverId from the data attribute which we have set manually
            receiverId = item.getAttribute('data-userid');

            // this willl get the username from the text content of the item
            const username = item.textContent.trim();

            // this will get the profilePic from the div
            const profilePic = item.getAttribute("data-profilepic");

            // this will close the user list panel
            document.getElementById('secondarySlider').classList.add('hidden');
            document.getElementById('secondarySlider').classList.remove('flex');

            const isOnline = onlineUsersSet.has(receiverId);
            const statusText = isOnline ? "Online" : "Offline";
            const statusTextColor = isOnline ? "text-success" : "text-secondary";

            // this will change the main content to the chat view
            mainContent.innerHTML = `
<header class="fixed top-0 w-full md:relative z-50 flex justify-between items-center h-16 px-4 md:px-8 bg-surface/10 backdrop-blur-xl border-b border-outline-variant/20 shadow-none">
<div class="flex items-center gap-4">
<div class="relative">
<img class="w-10 h-10 rounded-full object-cover" src="${profilePic}"/>
</div>
<div>
<h3 class="font-title-sm text-on-surface">${username}</h3>
<p id="chatHeaderStatus" class="text-[11px] font-label-sm ${typeof statusTextColor !== 'undefined' ? statusTextColor : 'text-success'}">${typeof statusText !== 'undefined' ? statusText : 'Online'}</p>
</div>
</div>
<div class="flex items-center gap-2">
<div class="flex items-center gap-1 md:gap-2 mr-0 md:mr-4">
<button id="videoCallBtn" class="p-2 text-on-surface-variant hover:bg-primary/10 rounded-full transition-colors active:scale-95 duration-200"><span class="material-symbols-outlined">videocam</span></button>
<button id="voiceCallBtn" class="p-2 text-on-surface-variant hover:bg-primary/10 rounded-full transition-colors active:scale-95 duration-200"><span class="material-symbols-outlined">call</span></button>
</div>
</div>
</header>
<div class="flex-1 overflow-y-auto p-6 md:p-8 space-y-4 scroll-smooth scrollbar-hide mt-16 md:mt-0" id="chatArea">
<p class="text-center font-bold text-on-surface-variant mt-10">Say hello to start your conversation with ${username} 👋</p>
</div>
<footer class="p-4 md:p-6 bg-surface-container-low/80 backdrop-blur-3xl border-t border-outline-variant/10">
<div class="max-w-5xl mx-auto relative flex items-end gap-3 md:gap-4">
<div class="flex-1 relative flex items-center bg-surface-variant/30 rounded-2xl p-1.5 glass-border border-primary/10 shadow-inner group focus-within:ring-2 focus-within:ring-primary/40 transition-all">

<div class="dropdown">
    <button class="p-2.5 text-on-surface-variant hover:text-primary transition-colors" id="attachmentBtn" data-bs-toggle="dropdown">
        <span class="material-symbols-outlined">add_circle</span>
    </button>
    <ul class="dropdown-menu dropdown-menu-dark bg-surface-container border-outline-variant/20" aria-labelledby="attachmentBtn">
        <li><label class="dropdown-item text-on-surface hover:bg-primary/20" for="fileImage" id="openPhotoVideo"><i class="bi bi-image-fill me-2"></i> Photo / Video</label><input type="file" id="fileImage" accept="image/*,video/*" style="display: none;"></li>
        <li><label class="dropdown-item text-on-surface hover:bg-primary/20" for="fileDocx" id="openDocx"><i class="bi bi-file-earmark-word-fill me-2"></i> Docx File</label><input type="file" id="fileDocx" accept=".doc,.docx" style="display: none;"></li>
        <li><label class="dropdown-item text-on-surface hover:bg-primary/20" for="filePdf" id="openPdf"><i class="bi bi-file-earmark-pdf-fill me-2"></i> PDF File</label><input type="file" id="filePdf" accept=".pdf" style="display: none;"></li>
    </ul>
</div>

<input id="messageInput" type="text" class="flex-1 bg-transparent border-none text-body-md text-on-surface focus:ring-0 placeholder:text-on-surface-variant/40 resize-none py-2.5 max-h-32 scrollbar-hide" placeholder="Type a message..." autocomplete="off">
</div>
<button id="sendBtn" class="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-primary-container text-white rounded-2xl shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">send</span>
</button>
</div>
</footer>
                `;
            const messageInput = document.getElementById("messageInput");
            const sendBtn = document.getElementById("sendBtn");

            // in this sendMessage function is in the SendMessage.js file
            sendBtn.addEventListener("click", sendMessage);
            messageInput.addEventListener("keydown", function (e) {
                if (e.key === "Enter") {
                    e.preventDefault();
                    sendMessage();
                }
            });

            // this function is in the loadPreviousChat.js file
            loadChatHistory(receiverId);

            // Setup Call Buttons
            const videoCallBtn = document.getElementById('videoCallBtn');
            const voiceCallBtn = document.getElementById('voiceCallBtn');
            if (videoCallBtn) {
                videoCallBtn.addEventListener('click', () => {
                    if (typeof startCall === 'function') {
                        startCall(receiverId, 'video', username, profilePic);
                    }
                });
            }
            if (voiceCallBtn) {
                voiceCallBtn.addEventListener('click', () => {
                    if (typeof startCall === 'function') {
                        startCall(receiverId, 'voice', username, profilePic);
                    }
                });
            }

            // this function will open the dialogue box to select the image/video
            OpenImageVideoBox();

            // this function will open the dialogue box to select the image/video
            OpenDocxBox();

            // this function will open the dialogue box to select the image/video
            OpenPdfBox();
        });
    });
}

function OpenImageVideoBox() {
    // Get elements
    const openPhotoVideo = document.getElementById("openPhotoVideo");
    const fileImage = document.getElementById("fileImage");

    // Listen for selected files
    fileImage.addEventListener("change", () => {
        if (fileImage.files.length > 0) {
            // console.log("Selected files:", fileImage.files);

            const file = fileImage.files[0];
            const reader = new FileReader();

            reader.onload = function (e) {
                const previewImg = document.getElementById("previewImage");
                const previewVid = document.getElementById("previewVideo");

                if (file.type.startsWith("image")) {
                    previewImg.src = e.target.result;
                    previewImg.style.display = "block";
                    previewVid.style.display = "none";
                } else if (file.type.startsWith("video")) {
                    previewVid.src = e.target.result;
                    previewVid.style.display = "block";
                    previewImg.style.display = "none";
                }

                // show modal
                const modal = new bootstrap.Modal(document.getElementById("imagePreviewModal"));
                modal.show();
            };
            reader.readAsDataURL(file);
        }
    });

    // handle send button
    document.getElementById("sendImageBtn").onclick = async () => {
        const file = fileImage.files[0];
        if (file) {
            // close modal
            const modalEl = document.getElementById("imagePreviewModal");
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();

            // here is the function that sends the image / video to the recierverId.
            await sendImageOrData(file, receiverId);

            // reset input so same image can be chosen again later
            fileImage.value = "";
        }
    };

    // when user clicks on the cancel button than we have to reset the fileImage in the input type.
    document.getElementById("cancelImageBtn").onclick = () => {
        fileImage.value = "";
        document.getElementById("previewImage").style.display = "none";
        document.getElementById("previewVideo").style.display = "none";
    };
}


async function sendImageOrData(file, receiverId) {
    // first we check the type of the file is it image or video?
    let Filetype;
    if (file.type.startsWith("image")) {
        Filetype = "image"
    } else if (file.type.startsWith("video")) {
        Filetype = "video"
    } else {
        return;
        // unsupported file type
    }

    // 261 to 264 : change
    const tempId = Date.now();
    renderTempBubble(file, tempId); // show placeholder immediately

    const formData = new FormData();
    formData.append("chatFile", file);
    formData.append("type", Filetype);


    const res = await fetch(`${BASE_URL}${ROUTE_NAME.UPLOAD_CHAT_IMAGE}`, {
        method: "POST",
        credentials: "include",
        body: formData
    });

    const data = await res.json();

    if (data.url) {
        // Replace temp bubble with final one 281 to 283 : Change
        updateTempBubble(tempId, data.url, Filetype);

        // Send only URL via Socket.IO
        // Emit to server from here the file (image / video ) send to the server.js and in server.js sendImageVideoFromSender this will handled and sent to the recieverId. 
        const messageObj = {
            senderId,
            receiverId,
            fileUrl: data.url,
            Filetype
        };

        socket.emit("sendImageVideoFromSender", messageObj);
    } else {
        Swal.fire({
            icon: "error",
            title: "Upload Failed",
            text: "Something went wrong while uploading your file. Please try again.",
            confirmButtonText: "OK"
        });
    }
}


// this function will show the sent image in the full screen.
function openImageModal(imageUrl) {
    const imgElement = document.getElementById("chatImagePreview");
    imgElement.src = imageUrl;

    const modal = new bootstrap.Modal(document.getElementById("chatImageModal"));
    modal.show();
}


// This function will show the sent video in the full screen modal
function openVideoModal(videoUrl) {
    const videoElement = document.getElementById("chatVideoPreview");
    videoElement.src = videoUrl;
    videoElement.play(); // autoplay when modal opens

    const modal = new bootstrap.Modal(document.getElementById("chatVideoModal"));
    modal.show();

    // Clear video when modal closes (avoid sound continuing)
    document.getElementById("chatVideoModal").addEventListener("hidden.bs.modal", () => {
        videoElement.pause();
        videoElement.currentTime = 0;
        videoElement.src = "";
    }, { once: true });
}


function renderTempBubble(file, tempId) {
    const localUrl = URL.createObjectURL(file);

    const bubble = document.createElement("div");
    bubble.className = "d-flex justify-content-end";
    bubble.id = `msg-${tempId}`;

    if (file.type.startsWith("image")) {
        bubble.innerHTML = `
            <div class="message-bubble message-sent position-relative">
                <img src="${localUrl}" 
                     class="chat-img" 
                     onload="scrollToBottom()" 
                     style="max-width:400px; border-radius: 10px; opacity: 0.7;" />
                <div class="sending-overlay d-flex justify-content-center align-items-center">
                    <div class="spinner-border text-light" style="width:1.5rem;height:1.5rem;"></div>
                </div>
            </div>
        `;
    } else if (file.type.startsWith("video")) {
        bubble.innerHTML = `
            <div class="message-bubble message-sent position-relative">
                <video src="${localUrl}" 
                       muted 
                       playsinline 
                       preload="metadata"
                       onloadeddata="scrollToBottom()"
                       style="max-width:400px; border-radius: 10px; opacity: 0.7; pointer-events:none;"></video>
                <div class="sending-overlay d-flex justify-content-center align-items-center">
                    <div class="spinner-border text-light" style="width:1.5rem;height:1.5rem;"></div>
                </div>
            </div>
        `;
    }

    chatArea.appendChild(bubble);
    scrollToBottom();
}


function updateTempBubble(tempId, fileUrl, Filetype) {
    const bubble = document.getElementById(`msg-${tempId}`);
    if (!bubble) return;

    if (Filetype === "image") {
        bubble.innerHTML = `
            <div class="message-bubble message-sent">
                <img src="${fileUrl}" alt="image" class="chat-img" onload="scrollToBottom()" style="max-width:400px; border-radius:10px; cursor:pointer;" onclick="openImageModal('${fileUrl}')" />
            </div>
        `;
    } else if (Filetype === "video") {
        bubble.innerHTML = `
        <div class="message-bubble  message-sent position-relative" style="display:inline-block; cursor:pointer;" onclick="openVideoModal('${fileUrl}')">
        
            <!-- Thumbnail frame -->
            <video src="${fileUrl}" muted playsinline preload="metadata" onload="scrollToBottom()" style="max-width:400px; border-radius:10px; pointer-events:none;"></video>
            
            <!-- Play button overlay -->
            <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); font-size:3rem; color:deeppink; opacity:0.9;">
                <i class="bi bi-play-circle-fill"></i>
            </div>
        </div>`;
    }
}

function OpenDocxBox() {
    // Docx
    const openDocx = document.getElementById("openDocx");
    const fileDocx = document.getElementById("fileDocx");

    fileDocx.addEventListener("change", () => {
        if (fileDocx.files.length > 0) {
            // console.log("Selected Docx:", fileDocx.files[0].name);

            const file = fileDocx.files[0];

            // Show file details in modal
            document.getElementById("docxFileName").textContent = file.name;
            document.getElementById("docxFileSize").textContent =
                `${(file.size / 1024).toFixed(2)} KB`;

            // Show modal
            const modal = new bootstrap.Modal(document.getElementById("docxPreviewModal"));
            modal.show();

        }
    });

    // handle send button
    document.getElementById("sendDocxBtn").onclick = async () => {
        const file = fileDocx.files[0];

        if (file) {
            // close modal
            const modalEl = document.getElementById("docxPreviewModal");
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();

            // here is the function that sends the Docx to the recierverId.
            await sendDocx(file, receiverId);

            // reset input so same image can be chosen again later
            fileDocx.value = "";
        }
    };

    // when user clicks on the cancel button than we have to reset the fileDocx in the input type.
    document.getElementById("cancelDocxBtn").onclick = () => {
        fileDocx.value = "";
    };

}


async function sendDocx(file, receiverId) {
    // [1] check that the file type is docx
    if (!(file.name.endsWith(".doc") || file.name.endsWith(".docx"))) {
        Swal.fire({
            icon: "error",
            title: "Invalid File",
            text: "Only .doc and .docx files are allowed!",
            confirmButtonText: "OK"
        });
        return;
    }

    const Filetype = "docx";
    const tempId = Date.now();


    // [2] show placeholder immediately
    renderTempBubbleForDocx(file, tempId, Filetype);

    // [3] upload DOCX file to server
    const formData = new FormData();
    formData.append("chatFile", file);
    formData.append("type", Filetype);

    const res = await fetch(`${BASE_URL}${ROUTE_NAME.UPLOAD_CHAT_DOCUMENT}`, {
        method: "POST",
        credentials: "include",
        body: formData
    });

    const data = await res.json();


    if (data.url) {
        const fileSizeKB = (file.size / 1024).toFixed(2); // <--- file size in KB

        // [4] Replace temp bubble with final one
        updateTempBubbleForDocx(tempId, data.url, Filetype, data.originalName, fileSizeKB);

        // [5] Create object & send via Socket.IO
        const messageObj = {
            senderId,
            receiverId,
            fileUrl: data.url,
            Filetype,
            originalName: data.originalName,
            fileSizeKB
        };

        socket.emit("sendDocxFromSender", messageObj);
    } else {
        Swal.fire({
            icon: "error",
            title: "Upload Failed",
            text: "Something went wrong while uploading your DOCX file. Please try again.",
            confirmButtonText: "OK"
        });

    }
}

function renderTempBubbleForDocx(file, tempId, Filetype = "image") {
    const bubble = document.createElement("div");
    bubble.className = "d-flex justify-content-end";
    bubble.id = `msg-${tempId}`;

    if (Filetype === "docx") {
        bubble.innerHTML = `
            <div class="message-bubble message-sent d-flex align-items-center gap-2">
                <i class="bi bi-file-earmark-word-fill text-primary fs-2"></i>
                <span>${file.name}</span>
                <div class="spinner-border text-light ms-2" style="width:1rem;height:1rem;"></div>
            </div>
        `;
    }
    chatArea.appendChild(bubble);
    chatArea.scrollTop = chatArea.scrollHeight;
}

function updateTempBubbleForDocx(tempId, fileUrl, Filetype, originalName = "document.docx", fileSizeKB) {
    const bubble = document.getElementById(`msg-${tempId}`);
    if (!bubble) return;

    if (Filetype === "docx") {
        bubble.innerHTML = `
            <div class="message-bubble message-sent d-flex align-items-center p-3"
                 style="border:1px solid #2f2f2f; border-radius:10px; background:#1c1c1c; max-width:20rem; height: 7rem">
                
                <!-- Word Icon -->
                <i class="bi bi-file-earmark-word-fill text-primary fs-1 me-3"></i>
                
                <!-- File Info -->
                <div class="d-flex flex-column">
                    <span class="fw-bold text-white">${originalName}</span>
                    <small class="text text-white" style="opacity:0.5">${fileSizeKB} KB, Microsoft Word Document</small>
                </div>
            </div>
        `;
    }


}


function OpenPdfBox() {
    // PDF
    const openPdf = document.getElementById("openPdf");
    const filePdf = document.getElementById("filePdf");

    filePdf.addEventListener("change", () => {
        if (filePdf.files.length > 0) {
            // console.log("Selected Pdf:", filePdf.files[0].name);

            const file = filePdf.files[0];

            // Show file details in modal
            document.getElementById("pdfFileName").textContent = file.name;
            document.getElementById("pdfFileSize").textContent =
                `${(file.size / 1024).toFixed(2)} KB`;

            // Show modal
            const modal = new bootstrap.Modal(document.getElementById("pdfPreviewModal"));
            modal.show();
        }
    });

    // handle send button
    document.getElementById("sendPdfBtn").onclick = async () => {
        const file = filePdf.files[0];

        if (file) {
            // close modal
            const modalEl = document.getElementById("pdfPreviewModal");
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();

            // here is the function that sends the Docx to the recierverId.
            await sendPdf(file, receiverId);

            // reset input so same image can be chosen again later
            filePdf.value = "";
        }
    };

    // when user clicks on the cancel button than we have to reset the fileDocx in the input type.
    document.getElementById("cancelPdfBtn").onclick = () => {
        filePdf.value = "";
    };
}

async function sendPdf(file, receiverId) {
    // [1] check that the file type is docx
    if (!(file.name.endsWith(".pdf"))) {
        Swal.fire({
            icon: "error",
            title: "Invalid File",
            text: "Only pdf file are allowed!",
            confirmButtonText: "OK"
        });
        return;
    }

    const Filetype = "pdf";
    const tempId = Date.now();


    // [2] show placeholder immediately
    renderTempBubbleForPdf(file, tempId, Filetype);

    // [3] upload DOCX file to server
    const formData = new FormData();
    formData.append("chatFile", file);
    formData.append("type", Filetype);

    const res = await fetch(`${BASE_URL}${ROUTE_NAME.UPLOAD_CHAT_PDF}`, {
        method: "POST",
        credentials: "include",
        body: formData
    });

    const data = await res.json();


    if (data.url) {
        const fileSizeKB = (file.size / 1024).toFixed(2); // <--- file size in KB

        // [4] Replace temp bubble with final one
        updateTempBubbleForPdf(tempId, data.url, Filetype, data.originalName, fileSizeKB);

        // [5] Create object & send via Socket.IO
        const messageObj = {
            senderId,
            receiverId,
            fileUrl: data.url,
            Filetype,
            originalName: data.originalName,
            fileSizeKB
        };

        socket.emit("sendPdfFromSender", messageObj);
    } else {
        Swal.fire({
            icon: "error",
            title: "Upload Failed",
            text: "Something went wrong while uploading your PDF file. Please try again.",
            confirmButtonText: "OK"
        });

    }
}


function renderTempBubbleForPdf(file, tempId, Filetype = "pdf") {
    const bubble = document.createElement("div");
    bubble.className = "d-flex justify-content-end";
    bubble.id = `msg-${tempId}`;

    if (Filetype === "pdf") {
        bubble.innerHTML = `
            <div class="message-bubble message-sent d-flex align-items-center gap-2">
                <i class="bi bi-file-earmark-pdf-fill text-danger fs-2"></i>
                <span>${file.name}</span>
                <div class="spinner-border text-light ms-2" style="width:1rem;height:1rem;"></div>
            </div>
        `;
    }
    chatArea.appendChild(bubble);
    chatArea.scrollTop = chatArea.scrollHeight;
}

function updateTempBubbleForPdf(tempId, fileUrl, Filetype, originalName = "document.pdf", fileSizeKB) {
    const bubble = document.getElementById(`msg-${tempId}`);
    if (!bubble) return;

    if (Filetype === "pdf") {
        bubble.innerHTML = `
            <div class="message-bubble message-sent d-flex align-items-center p-3"
                 style="border:1px solid #2f2f2f; border-radius:10px; background:#1c1c1c; max-width:20rem; height: 7rem">
                
                <!-- PDF Icon -->
                <i class="bi bi-file-earmark-pdf-fill text-danger fs-1 me-3"></i>
                
                <!-- File Info -->
                <div class="d-flex flex-column">
                    <span class="fw-bold text-white">${originalName}</span>
                    <small class="text text-white" style="opacity:0.5">${fileSizeKB} KB, PDF Document</small>
                </div>
            </div>
        `;
    }
}