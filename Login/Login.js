const LoginButton = document.getElementById('LoginButton');
LoginButton.addEventListener('click', async () => {
    const usernameInput = document.getElementById('usernameInput').value;
    const passwordInput = document.getElementById('passwordInput').value;

    if (!usernameInput || !passwordInput) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Please fill in all fields.'
        });
        return;
    }

    try {
        LoginButton.disabled = true;
        LoginButton.innerHTML = "Logging in...";
        const response = await fetch(`${BASE_URL}${ROUTE_NAME.LOGIN}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                username: usernameInput,
                password: passwordInput
            })
        });

        const data = await response.json();

        console.log(data);
        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                text: data.message,
                timer: 1500,
                showConfirmButton: false
            });

            setTimeout(async () => {
                try {
                    const statusResponse = await fetch(`${BASE_URL}${ROUTE_NAME.PROFILE_STATUS}`, {
                        method: 'GET',
                        credentials: 'include'
                    });

                    if (statusResponse.status === 200) {
                        window.location.href = '../Chatroom/Chatroom.html';
                    } else if (statusResponse.status === 204) {
                        window.location.href = '../ProfileSetup/ProfileSetup.html';
                    } else if (statusResponse.status === 404) {
                        Swal.fire({
                            icon: 'info',
                            title: 'User Profile Not Found',
                            text: 'Please create an account first.',
                            confirmButtonText: 'OK',
                            confirmButtonColor: '#7269ef'
                        }).then(() => {
                            window.location.href = '../SignUp/SignUp.html';
                        });
                    } else {
                        // Handle other statuses such as 401 Unauthorized securely
                        const errorData = await statusResponse.json();
                        Swal.fire({
                            icon: 'error',
                            title: 'Verification Failed',
                            text: errorData.message || 'Session verification failed. Please login again.',
                            confirmButtonColor: '#7269ef'
                        });
                    }
                } catch (error) {
                    console.error('Error during profile status check:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'An error occurred while checking your profile status. Please try again.'
                    });
                }
            }, 0);

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.message
            });
        }
    } catch (error) {
        console.error('Error during login:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Server Error. Please try again later.'
        });
    }finally{
        LoginButton.disabled = false;
        LoginButton.innerHTML = "Login";
    }
});

// --- Forgot Password Flow ---
document.addEventListener("DOMContentLoaded", () => {
    const forgotPasswordLink = document.getElementById("forgotPasswordLink");
    const forgotPasswordModal = document.getElementById("forgotPasswordModal");
    const closeForgotModalBtn = document.getElementById("closeForgotModalBtn");
    const sendForgotOtpBtn = document.getElementById("sendForgotOtpBtn");
    const verifyForgotOtpBtn = document.getElementById("verifyForgotOtpBtn");

    const forgotEmailStep = document.getElementById("forgotEmailStep");
    const forgotOtpStep = document.getElementById("forgotOtpStep");
    const forgotEmailInput = document.getElementById("forgotEmailInput");
    const forgotOtpInput = document.getElementById("forgotOtpInput");

    forgotPasswordLink.addEventListener("click", () => {
        forgotPasswordModal.classList.remove("hidden");
        forgotPasswordModal.classList.add("flex");
        // Reset state
        forgotEmailStep.classList.remove("hidden");
        forgotEmailStep.classList.add("block");
        forgotOtpStep.classList.add("hidden");
        forgotOtpStep.classList.remove("block");
        forgotEmailInput.value = "";
        forgotOtpInput.value = "";
    });

    closeForgotModalBtn.addEventListener("click", () => {
        forgotPasswordModal.classList.add("hidden");
        forgotPasswordModal.classList.remove("flex");
    });

    sendForgotOtpBtn.addEventListener("click", async () => {
        const email = forgotEmailInput.value.trim();
        if (!email) {
            Swal.fire({ icon: 'error', title: 'Oops!', text: 'Please enter your email.' });
            return;
        }

        const originalText = sendForgotOtpBtn.textContent;
        sendForgotOtpBtn.textContent = "Sending...";
        sendForgotOtpBtn.disabled = true;

        try {
            const res = await fetch(`${BASE_URL}${ROUTE_NAME.REQUEST_PASSWORD_RESET_OTP}`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();
            if (res.ok) {
                forgotEmailStep.classList.add("hidden");
                forgotEmailStep.classList.remove("block");
                forgotOtpStep.classList.remove("hidden");
                forgotOtpStep.classList.add("block");
                Swal.fire({ icon: 'success', title: 'OTP Sent', text: 'Please check your email for the OTP.' });
            } else {
                Swal.fire({ icon: 'error', title: 'Error', text: data.message || 'Failed to send OTP.' });
            }
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Server error. Try again later.' });
        } finally {
            sendForgotOtpBtn.textContent = originalText;
            sendForgotOtpBtn.disabled = false;
        }
    });

    verifyForgotOtpBtn.addEventListener("click", async () => {
        const email = forgotEmailInput.value.trim();
        const otp = forgotOtpInput.value.trim();

        if (!otp) {
            Swal.fire({ icon: 'error', title: 'Oops!', text: 'Please enter the OTP.' });
            return;
        }

        const originalText = verifyForgotOtpBtn.textContent;
        verifyForgotOtpBtn.textContent = "Verifying...";
        verifyForgotOtpBtn.disabled = true;

        try {
            const res = await fetch(`${BASE_URL}${ROUTE_NAME.VERIFY_PASSWORD_RESET_OTP}`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });

            const data = await res.json();
            if (res.ok) {
                forgotPasswordModal.classList.add("hidden");
                forgotPasswordModal.classList.remove("flex");
                Swal.fire({
                    icon: 'success',
                    title: 'Verified!',
                    text: 'Your password has been sent to your email.'
                });
            } else {
                Swal.fire({ icon: 'error', title: 'Error', text: data.message || 'Invalid OTP.' });
            }
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Server error. Try again later.' });
        } finally {
            verifyForgotOtpBtn.textContent = originalText;
            verifyForgotOtpBtn.disabled = false;
        }
    });
});
