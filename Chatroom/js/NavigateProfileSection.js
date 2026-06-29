const ProfileIcon = document.getElementById("ProfileIcon");
const logoutBtn = document.getElementById("logoutBtn");

if (ProfileIcon) {
    ProfileIcon.addEventListener("click", () => {
        window.location.href = "../Profile_Folder/Profile.html";
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        Swal.fire({
            icon: 'question',
            title: 'Are you sure you want to Logout?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            reverseButtons: true,
            confirmButtonColor: '#bc13fe',
            background: '#131315',
            color: '#e5e1e4'
        }).then((result) => {
            if (result.isConfirmed) {
                // Call logout API to clear cookie
                fetch(`${BASE_URL}${ROUTE_NAME.LOGOUT}`, {
                    method: "POST",
                    credentials: "include"
                });

                // Show success message with no buttons
                Swal.fire({
                    icon: 'success',
                    title: 'Successfully Logged Out!',
                    showConfirmButton: false,
                    timer: 2000,
                    background: '#131315',
                    color: '#e5e1e4'
                });

                // Redirect after 2 sec
                setTimeout(() => {
                    window.location.href = '../Login/Login.html';
                }, 2000);
            }
        });
    });
}