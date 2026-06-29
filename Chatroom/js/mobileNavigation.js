// mobileNavigation.js
// Handles the bottom navigation bar on mobile devices

document.addEventListener("DOMContentLoaded", () => {
    const mobileNavMessages = document.getElementById("mobileNavMessages");
    const mobileNavUsers = document.getElementById("mobileNavUsers");
    const mobileNavProfile = document.getElementById("mobileNavProfile");

    // References to the existing desktop sidebar buttons
    const userListBtn = document.getElementById("userListBtn");
    const allUsersBtn = document.getElementById("allUsersBtn");
    const ProfileIcon = document.getElementById("ProfileIcon");

    if (mobileNavMessages && userListBtn) {
        mobileNavMessages.addEventListener("click", () => {
            // Trigger the existing logic attached to the desktop button
            userListBtn.click();
            
            // Highlight the active mobile tab
            resetMobileNav();
            mobileNavMessages.classList.add("text-primary");
            mobileNavMessages.classList.remove("text-on-surface-variant");
        });
    }

    if (mobileNavUsers && allUsersBtn) {
        mobileNavUsers.addEventListener("click", () => {
            // Trigger the existing logic attached to the desktop button
            allUsersBtn.click();
            
            // Highlight the active mobile tab
            resetMobileNav();
            mobileNavUsers.classList.add("text-primary");
            mobileNavUsers.classList.remove("text-on-surface-variant");
        });
    }

    if (mobileNavProfile && ProfileIcon) {
        mobileNavProfile.addEventListener("click", () => {
            // This simply redirects to the profile page
            ProfileIcon.click();
        });
    }

    function resetMobileNav() {
        const btns = [mobileNavMessages, mobileNavUsers, mobileNavProfile];
        btns.forEach(btn => {
            if (btn) {
                btn.classList.remove("text-primary");
                btn.classList.add("text-on-surface-variant");
            }
        });
    }
});
