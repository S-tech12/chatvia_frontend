let localStream;
let remoteStream;
let peerConnection;
let currentCallId;
let currentCallType;
let isAudioMuted = false;
let isVideoMuted = false;
let callReceiverId = null; // The person we are talking to

// STUN Servers provided by Google
const servers = {
    iceServers: [
        {
            urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"]
        }
    ]
};

// Modals
let activeCallModalInstance;
let incomingCallModalInstance;

document.addEventListener("DOMContentLoaded", () => {
    activeCallModalInstance = new bootstrap.Modal(document.getElementById('activeCallModal'));
    incomingCallModalInstance = new bootstrap.Modal(document.getElementById('incomingCallModal'));
});

// Setup Listeners for Media Controls
document.getElementById('toggleMicBtn').addEventListener('click', () => {
    if (!localStream) return;
    isAudioMuted = !isAudioMuted;
    localStream.getAudioTracks()[0].enabled = !isAudioMuted;
    document.getElementById('micIcon').textContent = isAudioMuted ? 'mic_off' : 'mic';
});

document.getElementById('toggleCamBtn').addEventListener('click', () => {
    if (!localStream) return;
    isVideoMuted = !isVideoMuted;
    if (localStream.getVideoTracks().length > 0) {
        localStream.getVideoTracks()[0].enabled = !isVideoMuted;
    }
    document.getElementById('camIcon').textContent = isVideoMuted ? 'videocam_off' : 'videocam';
});

document.getElementById('endActiveCallBtn').addEventListener('click', () => {
    endCall();
});

// Create Peer Connection
const createPeerConnection = async (receiverId) => {
    peerConnection = new RTCPeerConnection(servers);
    
    remoteStream = new MediaStream();
    document.getElementById('remoteVideo').srcObject = remoteStream;

    // Add local tracks to peer connection
    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
    });

    // Listen for remote tracks
    peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track);
        });
    };

    // Listen for ICE candidates and send them to the peer
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            socket.emit('ice-candidate', {
                receiverId: receiverId,
                candidate: event.candidate
            });
        }
    };
};

// Start Media (Camera/Mic)
const startMedia = async (type) => {
    try {
        const constraints = {
            audio: true,
            video: type === 'video'
        };
        localStream = await navigator.mediaDevices.getUserMedia(constraints);
        
        const localVideo = document.getElementById('localVideo');
        localVideo.srcObject = localStream;

        if (type === 'voice') {
            document.getElementById('remoteVideoPlaceholder').classList.remove('hidden');
        } else {
            document.getElementById('remoteVideoPlaceholder').classList.add('hidden');
        }
        
    } catch (error) {
        console.error('Error accessing media devices.', error);
        Swal.fire({
            icon: 'error',
            title: 'Permission Denied',
            text: 'Please allow camera and microphone permissions.'
        });
        throw error;
    }
};

// Stop Media
const stopMedia = () => {
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }
    if (remoteStream) {
        remoteStream.getTracks().forEach(track => track.stop());
        remoteStream = null;
    }
    const localVideo = document.getElementById('localVideo');
    const remoteVideo = document.getElementById('remoteVideo');
    if (localVideo) localVideo.srcObject = null;
    if (remoteVideo) remoteVideo.srcObject = null;
    
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
};

// ========================
// Socket Event Listeners
// ========================

// 1. Initiate Call from UI Button
window.startCall = async (receiverId, type, name, profilePic) => {
    if (!receiverId) return;
    try {
        callReceiverId = receiverId;
        currentCallType = type;
        
        // Setup UI for Caller
        document.getElementById('activeCallUserName').textContent = name || "Calling...";
        document.getElementById('activeCallUserImg').src = profilePic || "../ProfileSetup/Default_Image.jpg";
        
        // Start Media
        await startMedia(type);
        activeCallModalInstance.show();

        // Emit call-user event
        socket.emit('call-user', { callerId: senderId, receiverId, callType: type });
    } catch (e) {
        console.error("Failed to start call", e);
    }
};

// 1.5 Call Initiated (Caller Side receives this)
socket.on('call-initiated', ({ callId }) => {
    currentCallId = callId;
});

// 2. Incoming Call
socket.on('incoming-call', ({ callerId, callType, callId }) => {
    console.log(`[WebRTC] incoming-call from ${callerId}`);
    // Backend now handles busy logic, so if we receive this, we show the modal.

    currentCallId = callId;
    callReceiverId = callerId;
    currentCallType = callType;

    // We need to fetch the caller details. Since we have them in onlineUsers or we can just show generic
    // In a real app, we might pass caller name/pic from backend, or find it in userList
    const callerElement = document.querySelector(`.user-item[data-userid="${callerId}"]`);
    const callerName = callerElement ? callerElement.textContent.trim() : "Unknown User";
    const callerPic = callerElement ? callerElement.getAttribute('data-profilepic') : "../ProfileSetup/Default_Image.jpg";

    document.getElementById('incomingCallerName').textContent = callerName;
    document.getElementById('incomingCallImg').src = callerPic;
    document.getElementById('incomingCallType').textContent = `Incoming ${callType} Call...`;

    document.getElementById('activeCallUserName').textContent = callerName;
    document.getElementById('activeCallUserImg').src = callerPic;

    incomingCallModalInstance.show();
});

// 3. User Offline or Busy
socket.on('user-offline', () => {
    Swal.fire({
        icon: 'info',
        title: 'User Offline',
        text: 'The user is currently offline.',
        timer: 2000
    });
    endCall(false); // don't emit to server since server told us
});

socket.on('user-busy', () => {
    Swal.fire({
        icon: 'info',
        title: 'User Busy',
        text: 'The user is on another call.',
        timer: 2000
    });
    endCall(false);
});

// 4. Accept / Reject Call Handlers (Receiver Side)
document.getElementById('acceptCallBtn').addEventListener('click', async () => {
    incomingCallModalInstance.hide();
    await startMedia(currentCallType);
    activeCallModalInstance.show();
    socket.emit('accept-call', { callId: currentCallId, callerId: callReceiverId, receiverId: senderId });
});

document.getElementById('rejectCallBtn').addEventListener('click', () => {
    incomingCallModalInstance.hide();
    socket.emit('reject-call', { callId: currentCallId, callerId: callReceiverId, receiverId: senderId });
    resetCallVariables();
});

// 5. Call Accepted (Caller Side receives this)
socket.on('call-accepted', async ({ receiverId, callId }) => {
    currentCallId = callId;
    // Receiver accepted, caller must create Offer
    await createPeerConnection(receiverId);

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    socket.emit('offer', { receiverId, offer });
});

// 6. Call Rejected (Caller Side receives this)
socket.on('call-rejected', () => {
    Swal.fire({
        icon: 'info',
        title: 'Call Rejected',
        text: 'The user rejected your call.',
        timer: 2000
    });
    endCall(false);
});

// 7. Handle Offer (Receiver Side)
socket.on('offer', async ({ offer, senderId: remoteSenderId }) => {
    await createPeerConnection(callReceiverId);
    
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    socket.emit('answer', { receiverId: callReceiverId, answer });
});

// 8. Handle Answer (Caller Side)
socket.on('answer', async ({ answer }) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
});

// 9. Handle ICE Candidate
socket.on('ice-candidate', async ({ candidate }) => {
    if (peerConnection) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
});

// 10. Call Ended by other user
socket.on('call-ended', () => {
    endCall(false);
});

// Helper: End Call
const endCall = (emitToServer = true) => {
    if (emitToServer && callReceiverId) {
        socket.emit('end-call', { 
            callId: currentCallId, 
            otherUserId: callReceiverId,
            userId: senderId
        });
    }
    
    stopMedia();
    
    if (activeCallModalInstance) activeCallModalInstance.hide();
    if (incomingCallModalInstance) incomingCallModalInstance.hide();
    
    resetCallVariables();
};

const resetCallVariables = () => {
    currentCallId = null;
    callReceiverId = null;
    currentCallType = null;
    isAudioMuted = false;
    isVideoMuted = false;
    document.getElementById('micIcon').textContent = 'mic';
    document.getElementById('camIcon').textContent = 'videocam';
};