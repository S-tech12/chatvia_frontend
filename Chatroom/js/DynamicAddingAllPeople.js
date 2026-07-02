// Open user list slider
allUsersBtn.addEventListener('click', () => {
    AllPeople();
    document.getElementById('secondarySlider').classList.remove('hidden');
    document.getElementById('secondarySlider').classList.add('flex');
});

// Close slider
closeSlider.addEventListener('click', () => {
    document.getElementById('secondarySlider').classList.add('hidden');
    document.getElementById('secondarySlider').classList.remove('flex');
});

async function AllPeople() {
    try {
        const response = await fetch(`${BASE_URL}${ROUTE_NAME.GET_ALL_USERS}`, {
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
                    <h4 class="mb-3">Find Users</h4>
                </div>
                
                <!-- Mobile Back Button -->
                <div class="md:hidden flex items-center p-4 border-b border-outline-variant/20 mb-4 cursor-pointer text-primary close-mobile-btn">
                    <span class="material-symbols-outlined">arrow_back</span>
                    <span class="ml-2 font-label-bold">Back</span>
                </div>
            `;

            if (UserData.AllPeople && UserData.AllPeople.length > 0) {
                mainContent.innerHTML = "";
                UserData.AllPeople.forEach(User => {
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

                Selection();
            } else {
                // Add "no conversation" message
                const noData = document.createElement("div");
                noData.classList.add("no-conversation");
                noData.textContent = "There is no any People to Chat.";
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

function Selection() {
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

            // mark chat room as active on mobile
            document.body.classList.add('chat-room-open');

            const isOnline = onlineUsersSet.has(receiverId);
            const statusText = isOnline ? "Online" : "Offline";
            const statusTextColor = isOnline ? "text-success" : "text-secondary";

            // this will change the main content to the chat view
            mainContent.innerHTML = `
<header class="fixed top-0 w-full md:relative z-50 flex justify-between items-center h-16 px-4 md:px-8 bg-surface/10 backdrop-blur-xl border-b border-outline-variant/20 shadow-none">
<div class="flex items-center gap-2 md:gap-4">
<button id="chatBackButton" class="md:hidden p-2 text-primary hover:bg-primary/10 rounded-full transition-colors active:scale-95 duration-200 flex items-center justify-center mr-1">
<span class="material-symbols-outlined">arrow_back</span>
</button>
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
<div class="w-full max-w-5xl mx-auto relative flex items-end gap-3 md:gap-4">
<div class="flex-1 min-w-0 relative flex items-center bg-surface-variant/30 rounded-2xl p-1.5 glass-border border-primary/10 shadow-inner group focus-within:ring-2 focus-within:ring-primary/40 transition-all">

<div class="dropdown">
    <button class="p-2.5 text-on-surface-variant hover:text-primary transition-colors flex items-center" id="attachmentBtn" data-bs-toggle="dropdown" type="button">
        <span class="material-symbols-outlined">add_circle</span>
    </button>
    <ul class="dropdown-menu dropdown-menu-dark bg-surface-container border-outline-variant/20" aria-labelledby="attachmentBtn">
        <li><label class="dropdown-item text-on-surface hover:bg-primary/20" for="fileImage" id="openPhotoVideo"><i class="bi bi-image-fill me-2"></i> Photo / Video</label><input type="file" id="fileImage" accept="image/*,video/*" style="display: none;"></li>
        <li><label class="dropdown-item text-on-surface hover:bg-primary/20" for="fileDocx" id="openDocx"><i class="bi bi-file-earmark-word-fill me-2"></i> Docx File</label><input type="file" id="fileDocx" accept=".doc,.docx" style="display: none;"></li>
        <li><label class="dropdown-item text-on-surface hover:bg-primary/20" for="filePdf" id="openPdf"><i class="bi bi-file-earmark-pdf-fill me-2"></i> PDF File</label><input type="file" id="filePdf" accept=".pdf" style="display: none;"></li>
    </ul>
</div>

<input id="messageInput" type="text" class="flex-1 min-w-0 bg-transparent border-none text-body-md text-on-surface focus:ring-0 placeholder:text-on-surface-variant/40 resize-none py-2.5 max-h-32 scrollbar-hide" placeholder="Type a message..." autocomplete="off">

</div>
<button id="sendBtn" class="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-primary-container text-white rounded-2xl shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">send</span>
</button>
</div>
</footer>
                `;
            const messageInput = document.getElementById("messageInput");
            const sendBtn = document.getElementById("sendBtn");

            // Back button event listener for mobile view
            const chatBackButton = document.getElementById("chatBackButton");
            if (chatBackButton) {
                chatBackButton.addEventListener("click", () => {
                    document.body.classList.remove("chat-room-open");
                    document.getElementById("secondarySlider").classList.remove("hidden");
                    document.getElementById("secondarySlider").classList.add("flex");
                });
            }

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

            // Initialize the file input listeners (these functions are in DynamicAddingChattedPeople.js)
            OpenImageVideoBox();
            OpenDocxBox();
            OpenPdfBox();
        });
    });
}