// Retrieve the registration form
const registrationForm = document.getElementById('registrationForm');

// Add an event listener to the form submission
registrationForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Get values from form fields 
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // RegEx for email validation
    const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if the email is valid
    if (!emailRegEx.test(email)) {
        alert('Please enter a valid email address, must contain at @ symbol .');
        return;
    }

    // RegEx for password validation
    const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    // Check if passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    // Check if the password meets the security requirements
    if (!passwordRegEx.test(password)) {
        alert('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.');
        return;
    }

    // Check if username is already taken
    if (localStorage.getItem(username)) {
        alert('Username is already taken.');
        return;
    }

    // Check if email is already registered
    if (localStorage.getItem(email)) {
        alert('Email is already registered.');
        return;
    }

    // Create a user object
    const user = {
        username,
        email,
        password,
        score: 0 // Initialize the user's score to 0
    };

    // Store the user data in localStorage
    localStorage.setItem(username, JSON.stringify(user));

    alert('Registration successful!');
});

//This is to display the current user on the registration page//    
function displayCurrentUser() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const userDisplayElement = document.getElementById('userDisplay');
        if (userDisplayElement) {
            userDisplayElement.innerText = `Current user : ${currentUser}`;
        }
    }
}

window.onload = function () {
    displayCurrentUser();
}