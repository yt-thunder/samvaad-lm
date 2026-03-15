```
const loginForm = document.getElementById('login-form');
const rememberMeCheckbox = document.getElementById('remember');

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('rememberedUsername')) {
        loginForm.username.value = localStorage.getItem('rememberedUsername');
        rememberMeCheckbox.checked = true;
    }
});

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const username = loginForm.username.value;
    const password = loginForm.password.value;

    if (username === 'admin' && password === 'password') {
        handleRememberMe(rememberMeCheckbox, username);
        window.location.href = 'admin_dashboard.html';
    } else {
        alert('Invalid username or password');
    }
});

function handleRememberMe(checkbox, username) {
    if (checkbox.checked) {
        localStorage.setItem('rememberedUsername', username);
    } else {
        localStorage.removeItem('rememberedUsername');
    }
}
```