const BASE_URL = "http://localhost:3000";


const ROUTE_NAME = {

    // =========================
    // AUTH ROUTES
    // =========================
    REGISTER: "/api/auth/register",
    VERIFY_OTP: "/api/auth/verify-otp",
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    REQUEST_PASSWORD_RESET_OTP: "/api/auth/password-reset/request-otp",
    VERIFY_PASSWORD_RESET_OTP: "/api/auth/password-reset/verify-otp",


    // =========================
    // USER ROUTES
    // =========================
    VERIFY_TOKEN: "/me/verify-token",
    PROFILE_STATUS: "/me/profile-status",
    GET_PROFILE: "/me",
    UPDATE_PROFILE: "/me/profile",
    UPDATE_PROFILE_PICTURE: "/me/profile-picture",
    SEND_PROFILE_UPDATE_OTP: "/me/profile/otp",
    UPDATE_PROFILE_DETAILS: "/me/profile/details",
    GET_ALL_USERS: "/me/users",
    DELETE_ACCOUNT: "/me",


    // =========================
    // CHAT ROUTES
    // =========================
    GET_CHAT_USERS: "/chats/users",


    // =========================
    // MESSAGE ROUTES
    // =========================
    GET_CHAT_HISTORY: "/messages", // append /:receiverId dynamically
    UPLOAD_CHAT_IMAGE: "/messages/files/images",
    UPLOAD_CHAT_DOCUMENT: "/messages/files/documents",
    UPLOAD_CHAT_PDF: "/messages/files/pdfs",


    // =========================
    // CALL ROUTES
    // =========================
    CALL_HISTORY: "/calls/history"
};