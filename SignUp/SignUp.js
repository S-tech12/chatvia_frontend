const SignUpButton = document.getElementById('SignUpButton');

SignUpButton.addEventListener('click', async (event) => {
    // Prevent the default form submission
    event.preventDefault();

    // disable the button to prevent multiple submissions
    SignUpButton.disabled = true;
    SignUpButton.innerText = 'Signing Up...';

    // Get the form element
    const UserEmail = document.getElementById('UserEmail').value;
    const UserFullName = document.getElementById('UserFullName').value;
    const UserMobileNumber = document.getElementById('UserMobileNumber').value;
    const UserName = document.getElementById('UserName').value;
    const UserPassword = document.getElementById('UserPassword').value;
    const UserConfirmPassword = document.getElementById('UserConfirmPassword').value;

    // Stop further execution if validation fails
    if (!UserEmail || !UserFullName || !UserMobileNumber || !UserName || !UserPassword || !UserConfirmPassword) {
        Swal.fire({
            icon: 'error',
            title: 'Missing Fields',
            text: 'Please fill out all required fields!'
        });
        SignUpButton.disabled = false;
        SignUpButton.innerText = 'Sign Up';
        return;
    }

    if (UserPassword != UserConfirmPassword) {
        Swal.fire({
            icon: 'error',
            title: 'Mismatch Passwords',
            text: 'Both Password are not same . Check it once more time!'
        });
        SignUpButton.disabled = false;
        SignUpButton.innerText = 'Sign Up';
        return;
    }

    // Stop further execution if e-mail validation fails
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(UserEmail)) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Email',
            text: 'Please enter a valid email address!'
        });
        SignUpButton.disabled = false;
        SignUpButton.innerText = 'Sign Up';
        return;
    }

    // Stop further execution if MobileNumber validation fails
    if (!/^\d{10}$/.test(UserMobileNumber)) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Mobile Number',
            text: 'Please enter a valid 10-digit mobile number!'
        });
        SignUpButton.disabled = false;
        SignUpButton.innerText = 'Sign Up';
        return;
    }

    // If all validations pass, proceed with the form submission
    const formData = {
        email: UserEmail,
        fullName: UserFullName,
        mobileNumber: UserMobileNumber,
        username: UserName,
        Password: UserPassword
    };

    // Simulate form submission (e.g., send data to server)
    const response = await fetch(`${BASE_URL}${ROUTE_NAME.REGISTER}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });
    

    if (response.ok) {
        // handle OTP taken from user and validate it
        Swal.fire({
            icon: 'success',
            title: 'Enter OTP',
            text: 'An OTP has been sent to your email. Please enter it to complete the sign-up process.',
            input: 'text',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const Enteredotp = result.value;

                // Disable the button to prevent multiple submissions
                SignUpButton.disabled = true;
                SignUpButton.innerText = 'Validating OTP...';

                // Send the OTP to the server for validation
                const otpResponse = await fetch(`${BASE_URL}${ROUTE_NAME.VERIFY_OTP}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: UserEmail, Enteredotp })
                });
                

                if (otpResponse.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Account Created',
                        text: 'Username and password have been set successfully. You will be redirecting to Login Page shortly.',
                        timer: 5000,
                        timerProgressBar: true,
                    });

                    // redirect to login page after 3 seconds
                    setTimeout(() => {
                        SignUpButton.disabled = false;
                        SignUpButton.innerText = 'Sign Up';
                        window.location.href = '../Login/Login.html';
                    }, 5000);
                } else {
                    SignUpButton.disabled = false;
                    SignUpButton.innerText = 'Sign Up';
                    const errorData = await otpResponse.json();
                    Swal.fire({
                        icon: 'error',
                        title: 'OTP Validation Failed',
                        text: errorData.message || 'Invalid OTP. Please try again.'
                    });
                }
            }
        });
    } else {
        SignUpButton.disabled = false;
        SignUpButton.innerText = 'Sign Up';
        const errorData = await response.json();
        Swal.fire({
            icon: 'error',
            title: 'Sign Up Failed',
            text: errorData.message || 'An error occurred during sign up.'
        });
    }
});
