document.addEventListener("DOMContentLoaded", async () => {
    try {
        const result = await fetch(`${BASE_URL}${ROUTE_NAME.GET_PROFILE}`, {
            method: "GET",
            credentials: "include"
        });

        if (result.ok) {
            const data = await result.json();
            const user = data.findUser;

            // Profile Picture
            const ProfileImage = user.profilePic && user.profilePic.trim() !== "" ? user.profilePic : "../ProfileSetup/Default_Image.jpg";
            const profilePicEl = document.getElementById("profilePic");
            profilePicEl.src = ProfileImage;

            // Full Name (Display Name / title)
            document.getElementById("fullname").textContent = user.fullName || "Unknown User";

            // Editable Fields
            document.getElementById("username").value = user.username || "";
            document.getElementById("userEmailId").value = user.email || "";
            document.getElementById("bio").value = user.bio || "";

            // Read-only Fields
            document.getElementById("UserMobileNo").innerHTML = `<strong>Phone No:</strong> ${user.mobileNumber || ""}`;
            document.getElementById("UserDOB").innerHTML = `<strong>DOB:</strong> ${user.dob ? new Date(user.dob).toLocaleDateString() : ""}`;
            document.getElementById("UserCreatedAt").innerHTML = `<strong>Created At:</strong> ${user.createdAt ? new Date(user.createdAt).toLocaleString() : ""}`;
            document.getElementById("UserUpdatedAt").innerHTML = `<strong>Updated At:</strong> ${user.updatedAt ? new Date(user.updatedAt).toLocaleString() : ""}`;
        } else {
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "There is mismatch with your profile. Please try again later.",
            });
        }
    } catch (err) {
        console.error(err);
        Swal.fire({
            icon: "error",
            title: "Oops!",
            text: "Unable to load your profile. Please try again later.",
        });
    }

    // --- Profile Image Upload Modal Logic ---
    const profileImageModal = document.getElementById("profileImageModal");
    const editProfilePicBtn = document.getElementById("editProfilePicBtn");
    const closeImageModalBtn = document.getElementById("closeImageModalBtn");
    const imageUploadArea = document.getElementById("imageUploadArea");
    const profileImageInput = document.getElementById("profileImageInput");
    const imagePreviewContainer = document.getElementById("imagePreviewContainer");
    const imagePreview = document.getElementById("imagePreview");
    const uploadImageBtn = document.getElementById("uploadImageBtn");

    editProfilePicBtn.addEventListener("click", () => {
        profileImageModal.classList.remove("hidden");
        profileImageModal.classList.add("flex");
    });

    closeImageModalBtn.addEventListener("click", () => {
        profileImageModal.classList.add("hidden");
        profileImageModal.classList.remove("flex");
        resetImageUploadModal();
    });

    imageUploadArea.addEventListener("click", () => profileImageInput.click());

    profileImageInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreviewContainer.classList.remove("hidden");
                imagePreviewContainer.classList.add("flex");
                imageUploadArea.classList.add("hidden");
                uploadImageBtn.disabled = false;
            };
            reader.readAsDataURL(file);
        }
    });

    function resetImageUploadModal() {
        profileImageInput.value = "";
        imagePreview.src = "";
        imagePreviewContainer.classList.add("hidden");
        imagePreviewContainer.classList.remove("flex");
        imageUploadArea.classList.remove("hidden");
        uploadImageBtn.disabled = true;
    }

    uploadImageBtn.addEventListener("click", async () => {
        const file = profileImageInput.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("profilePic", file);

        const originalText = uploadImageBtn.textContent;
        uploadImageBtn.textContent = "Uploading...";
        uploadImageBtn.disabled = true;

        try {
            const res = await fetch(`${BASE_URL}${ROUTE_NAME.UPDATE_PROFILE_PICTURE}`, {
                method: "POST",
                credentials: "include",
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                document.getElementById("profilePic").src = data.profilePic;
                profileImageModal.classList.add("hidden");
                profileImageModal.classList.remove("flex");
                resetImageUploadModal();
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Profile picture updated successfully!"
                });
            } else {
                throw new Error("Failed to upload");
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to upload profile picture."
            });
        } finally {
            uploadImageBtn.textContent = originalText;
            uploadImageBtn.disabled = false;
        }
    });

    // --- Profile Data Update & OTP Logic ---
    const saveChangesBtn = document.getElementById("saveChangesBtn");
    const otpVerificationModal = document.getElementById("otpVerificationModal");
    const closeOtpModalBtn = document.getElementById("closeOtpModalBtn");
    const confirmUpdateBtn = document.getElementById("confirmUpdateBtn");

    closeOtpModalBtn.addEventListener("click", () => {
        otpVerificationModal.classList.add("hidden");
        otpVerificationModal.classList.remove("flex");
    });

    saveChangesBtn.addEventListener("click", async () => {
        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("userEmailId").value.trim();
        const bio = document.getElementById("bio").value.trim();
        const newPassword = document.getElementById("newPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (!username || !email || !bio) {
            Swal.fire({ icon: 'error', title: 'Oops!', text: 'Display Name, Email, and Bio are required.' });
            return;
        }

        if (newPassword && newPassword !== confirmPassword) {
            Swal.fire({ icon: 'error', title: 'Oops!', text: 'New passwords do not match.' });
            return;
        }

        // Send OTP
        const originalText = saveChangesBtn.textContent;
        saveChangesBtn.textContent = "Sending OTP...";
        saveChangesBtn.disabled = true;

        try {
            const res = await fetch(`${BASE_URL}${ROUTE_NAME.SEND_PROFILE_UPDATE_OTP}`, {
                method: "POST",
                credentials: "include"
            });

            if (res.ok) {
                otpVerificationModal.classList.remove("hidden");
                otpVerificationModal.classList.add("flex");
                document.getElementById("verifyCurrentPassword").value = "";
                document.getElementById("verifyOtpInput").value = "";
            } else {
                throw new Error("Failed to send OTP");
            }
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Could not send OTP. Please try again later.' });
        } finally {
            saveChangesBtn.textContent = originalText;
            saveChangesBtn.disabled = false;
        }
    });

    confirmUpdateBtn.addEventListener("click", async () => {
        const currentPassword = document.getElementById("verifyCurrentPassword").value;
        const otp = document.getElementById("verifyOtpInput").value.trim();

        if (!currentPassword || !otp) {
            Swal.fire({ icon: 'error', title: 'Oops!', text: 'Both current password and OTP are required.' });
            return;
        }

        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("userEmailId").value.trim();
        const bio = document.getElementById("bio").value.trim();
        const newPassword = document.getElementById("newPassword").value;

        const originalText = confirmUpdateBtn.textContent;
        confirmUpdateBtn.textContent = "Verifying...";
        confirmUpdateBtn.disabled = true;

        try {
            const res = await fetch(`${BASE_URL}${ROUTE_NAME.UPDATE_PROFILE_DETAILS}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({
                    currentPassword,
                    otp,
                    username,
                    email,
                    bio,
                    newPassword
                })
            });

            const data = await res.json();
            if (res.ok) {
                otpVerificationModal.classList.add("hidden");
                otpVerificationModal.classList.remove("flex");
                Swal.fire({ icon: 'success', title: 'Updated!', text: 'Profile data updated successfully.' });
                // Optional: clear new password fields
                document.getElementById("newPassword").value = "";
                document.getElementById("confirmPassword").value = "";
            } else {
                Swal.fire({ icon: 'error', title: 'Error', text: data.message || 'Verification failed.' });
            }
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'An error occurred during update.' });
        } finally {
            confirmUpdateBtn.textContent = originalText;
            confirmUpdateBtn.disabled = false;
        }
    });
});