// Password Visibility Toggle
const passwordInput = document.getElementById('passwordInput');
const toggleButton = document.getElementById('toggleEyePwd');
const eyeIcon = document.getElementById('eyeIconPwd');

if (toggleButton && passwordInput && eyeIcon) {
    toggleButton.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        eyeIcon.textContent = isPassword ? 'visibility_off' : 'visibility';
        
        // Add a little pop animation
        eyeIcon.classList.add('scale-125');
        setTimeout(() => eyeIcon.classList.remove('scale-125'), 150);
    });
}

// Atmospheric Micro-interaction: Mouse move parallax for background orbs
document.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.floating-orb');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 20;
        orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
});

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
    });
}