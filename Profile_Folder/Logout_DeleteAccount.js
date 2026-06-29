const LogoutButton = document.getElementById("LogoutButton");
const DeleteAccountButton = document.getElementById("DeleteAccountButton");

DeleteAccountButton.addEventListener("click", DeleteAccount);
LogoutButton.addEventListener("click", Logout);

// this function is for logout
async function Logout() {
    Swal.fire({
        icon: 'question',
        title: 'Are you sure you want to Logout?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        reverseButtons: true
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
                timer: 2000
            });

            // Redirect after 2 sec
            setTimeout(() => {
                window.location.href = '../Login/Login.html';
            }, 2000);
        }
    });
}


// this function is for deleting the account
async function DeleteAccount() {
    Swal.fire({
        icon: 'question',
        title: 'Are you sure you want to Delete Account?',
        text: "Once you delete the account it can\'t be recover",
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        reverseButtons: true
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`${BASE_URL}${ROUTE_NAME.DELETE_ACCOUNT}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                })

                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Account Deleted Successfully!',
                        showConfirmButton: false,
                        timer: 2000
                    }).then(() => {
                        window.location.href = "../SignUp/SignUp.html";
                    })

                    setTimeout(() => {
                        window.location.href = "../SignUp/SignUp.html";
                    }, 2000);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Delete Failed',
                        text: 'Unable to delete your account. Please try again later.'
                    });
                    return;
                }
            } catch (err) {
                console.error("Error deleting account:", err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to delete account. Please try again.'
                });
            }
        }
    });
}