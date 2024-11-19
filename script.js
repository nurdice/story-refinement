// Store registered users
let users = [];

function showForm(formType) {
    // Hide all forms
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('guestForm').style.display = 'none';

    // Show selected form
    document.getElementById(`${formType}Form`).style.display = 'flex';
}

function register() {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    if (!name || !email || !password) {
        alert('Please fill in all fields');
        return;
    }

    // Check if email already exists
    if (users.find(user => user.email === email)) {
        alert('Email already registered');
        return;
    }

    users.push({ name, email, password });
    alert('Registration successful! You can now login with your email and password.');
    showForm('login');
}

function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const user = users.find(user => user.email === email && user.password === password);
    
    if (user) {
        // Store user info in localStorage
        const userInfo = {
            name: user.name,
            email: user.email,
            isGuest: false
        };
        localStorage.setItem('currentUser', JSON.stringify(userInfo));
        window.location.href = 'session.html';
    } else {
        alert('Invalid email or password');
    }
}

function guestLogin() {
    const guestName = document.getElementById('guestName').value;
    
    if (!guestName) {
        alert('Please enter your name');
        return;
    }

    // Store guest info in localStorage
    const guestInfo = {
        name: guestName,
        email: `guest_${Date.now()}@temp.com`,
        isGuest: true
    };
    localStorage.setItem('currentUser', JSON.stringify(guestInfo));
    window.location.href = 'session.html';
}

// Add this to test if the script is loading
console.log('Script loaded successfully');
 