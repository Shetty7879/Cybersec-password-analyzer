const passwordInput = document.getElementById('password-input');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');
const suggestionsList = document.getElementById('suggestions-list');
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// Common passwords list
const commonPasswords = [
    'password', '123456', '12345678', '1234', 'qwerty', 'admin', 'welcome', 'login'
];

// Strength Colors and Labels
const strengthLevels = [
    { label: 'Very Weak', color: 'var(--strength-very-weak)', width: '20%' },
    { label: 'Weak', color: 'var(--strength-weak)', width: '40%' },
    { label: 'Medium', color: 'var(--strength-medium)', width: '60%' },
    { label: 'Strong', color: 'var(--strength-strong)', width: '80%' },
    { label: 'Very Strong', color: 'var(--strength-very-strong)', width: '100%' }
];

// Splash Screen Logic
window.addEventListener('load', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        const mainContent = document.getElementById('main-content');

        splash.classList.add('hidden');
        mainContent.style.opacity = '1';
    }, 2500); // 2.5 seconds delay
});

function checkStrength(password) {
    let score = 0;
    let suggestions = [];

    if (password.length === 0) {
        return { score: -1, suggestions: [] };
    }

    // Check Common Passwords
    if (commonPasswords.includes(password.toLowerCase())) {
        return {
            score: 0,
            suggestions: ['This is a very common password. Please choose something else.']
        };
    }

    // Criteria
    const hasLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (hasLength) score++;
    if (hasUpper) score++;
    if (hasLower) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;

    // Suggestions
    if (!hasLength) suggestions.push('Use at least 8 characters');
    if (!hasUpper) suggestions.push('Include at least one uppercase letter');
    if (!hasLower) suggestions.push('Include at least one lowercase letter');
    if (!hasNumber) suggestions.push('Include at least one number');
    if (!hasSpecial) suggestions.push('Include at least one special character');

    // Adjust score 0-based index for array mapping (0 to 4)
    // If length < 8, cap score at 1 ("Weak") even if complexity is high
    if (!hasLength && score > 1) {
        score = 1;
    }

    // Convert count (1-5) to index (0-4)
    let index = Math.max(0, score - 1);

    // Logic refinement: if barely anything matches, it's very weak
    if (score === 0) index = 0;

    return { score: index, suggestions, isPerfect: score === 5 };
}

function updateUI() {
    const password = passwordInput.value;
    const result = checkStrength(password);

    // Reset if empty
    if (result.score === -1) {
        strengthBar.style.width = '0';
        strengthText.textContent = '';
        strengthText.style.color = 'inherit';
        suggestionsList.innerHTML = '';
        return;
    }

    const level = strengthLevels[result.score];

    // Update Meter
    strengthBar.style.width = level.width;
    strengthBar.style.backgroundColor = level.color;
    strengthBar.style.boxShadow = `0 0 10px ${level.color}`;

    // Update Text
    strengthText.textContent = level.label;
    strengthText.style.color = level.color;

    // Update Suggestions
    suggestionsList.innerHTML = '';

    if (result.isPerfect) {
        const li = document.createElement('li');
        li.textContent = 'Your password is secure';
        li.classList.add('valid');
        li.style.color = 'var(--primary)';
        // Remove '>' content via class or just inline style
        suggestionsList.appendChild(li);
    } else {
        result.suggestions.forEach(msg => {
            const li = document.createElement('li');
            li.textContent = msg;
            suggestionsList.appendChild(li);
        });
    }
}

// Event Listeners
passwordInput.addEventListener('input', updateUI);

// Theme Toggle
themeToggle.addEventListener('click', () => {
    const isDark = htmlElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', savedTheme);

// Generate Strong Password
const generateBtn = document.getElementById('generate-btn');

function generatePassword() {
    const length = 16;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let retVal = "";

    // Ensure at least one of each required type
    retVal += "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(Math.floor(Math.random() * 26));
    retVal += "abcdefghijklmnopqrstuvwxyz".charAt(Math.floor(Math.random() * 26));
    retVal += "0123456789".charAt(Math.floor(Math.random() * 10));
    retVal += "!@#$%^&*()_+~`|}{[]:;?><,./-=".charAt(Math.floor(Math.random() * 29));

    // Fill the rest
    for (let i = 0, n = charset.length; i < length - 4; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }

    // Shuffle the result to mix the guaranteed characters
    retVal = retVal.split('').sort(() => 0.5 - Math.random()).join('');

    passwordInput.value = retVal;
    updateUI();
}

generateBtn.addEventListener('click', generatePassword);

// Password Visibility Toggle
const togglePassword = document.getElementById('toggle-password');

togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    // Update icon
    togglePassword.textContent = type === 'password' ? '👁️' : '🔒';
});
