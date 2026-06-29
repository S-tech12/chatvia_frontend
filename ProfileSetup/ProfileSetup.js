document.addEventListener('DOMContentLoaded', async () => {
    try {

        const response = await fetch(`${BASE_URL}${ROUTE_NAME.VERIFY_TOKEN}`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            console.log("IT COMES HERE AND HERE IS THE PROBLEM!!");
            swal.fire({
                icon: 'error',
                title: 'Session Expired',
                text: 'Please log in again.',
                confirmButtonText: 'OK',
                confirmButtonColor: '#7269ef'
            }).then(() => {
                window.location.href = '../Login/Login.html';
            });
        } else {
            const statusResponse = await fetch(`${BASE_URL}${ROUTE_NAME.PROFILE_STATUS}`, {
                method: 'GET',
                credentials: 'include'
            });

            if (statusResponse.status === 200) {
                swal.fire({
                    icon: 'success',
                    title: 'Profile Found',
                    text: 'You already have a profile set up.',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#7269ef'
                });
                setTimeout(() => {
                    window.location.href = '../Chatroom/Chatroom.html';
                }, 3000);

            } else if (statusResponse.status === 404) {
                swal.fire({
                    icon: 'info',
                    title: 'User Profile Not Found',
                    text: 'Please create an account first.',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#7269ef'
                }).then(() => {
                    setTimeout(() => {
                        window.location.href = '../SignUp/SignUp.html';
                    }, 1000);
                });
            }
        }
    } catch (error) {
        console.error('Error checking token:', error);
        swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while checking your session. Please try again.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#7269ef'
        }).then(() => {
            window.location.href = '../Login/Login.html';
        });
    }
})




// this will skip the user to update their profile later  
document.getElementById('skipBtn').addEventListener('click', function () {
    Swal.fire({
        icon: 'info',
        title: 'Profile Setup Skipped',
        text: 'You can change your profile later in settings.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#7269ef'
    }).then(function (result) {
        if (result.isConfirmed) {
            window.location.href = '../Chatroom/Chatroom.html';
        }
    });
});


const UpdateButton = document.getElementById('UpdateButton');
UpdateButton.addEventListener('click', async (event) => {

    event.preventDefault(); // Prevent the default form submission

    // Get the form values
    const nickname = document.getElementById('Nickname').value;
    const dob = document.getElementById('DOB').value;
    const profilePic = document.getElementById('ProfilePic').files[0];
    const bio = document.getElementById('bio').value;

    // disable the button to prevent multiple submissions
    UpdateButton.disabled = true;
    UpdateButton.innerText = 'Updating...';

    if (!nickname || !dob || !bio) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Please fill in all fields.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#7269ef'
        });
        UpdateButton.disabled = false;
        UpdateButton.innerText = 'Save & Continue';
        return;
    }

    const formData = new FormData();
    formData.append('nickname', nickname);
    formData.append('dob', dob);
    if (profilePic) {
        formData.append('profilePic', profilePic); // Append the file directly
    }
    formData.append('bio', bio);


    // Simulate a server request
    const response = await fetch(`${BASE_URL}${ROUTE_NAME.UPDATE_PROFILE}`, {
        method: 'POST',
        credentials: 'include',
        body: formData
    });

    if (response.ok) {
        UpdateButton.disabled = false;
        UpdateButton.innerText = 'Save & Continue';
        Swal.fire({
            icon: 'success',
            title: 'Profile Updated',
            text: 'Your profile has been updated successfully.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#7269ef'
        }).then(function (result) {
            if (result.isConfirmed) {
                window.location.href = '../Chatroom/Chatroom.html';
            }
            setTimeout(() => {
                window.location.href = '../Chatroom/Chatroom.html';
            }, 2000);
        });
    } else {
        UpdateButton.disabled = false;
        UpdateButton.innerText = 'Save & Continue';
        Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: 'There was an error updating your profile. Please try again.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#7269ef'
        });
    }
});
