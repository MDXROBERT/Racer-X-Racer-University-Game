loginForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Get values from form fields
    const loginUsername = document.getElementById('loginUsername').value;
    const loginPassword = document.getElementById('loginPassword').value;
    const loginEmail = document.getElementById('loginEmail').value;

    // Check if the user exists in localStorage
    const storedUserData = localStorage.getItem(loginUsername);

    if (storedUserData) {
        const userData = JSON.parse(storedUserData);

        // Check if the password and email match
        if (userData.password === loginPassword && userData.email === loginEmail) {
            alert('Login successful! Redirecting to the game page.');
            localStorage.setItem('currentUser', loginUsername);

            // Retrieve and display the user's score from leaderboard data
            const userScore = userData.score;
            alert('Your Score: ' + userScore); // Display the score 

            window.location.href = '../HTML CODE/game1.html'; // Redirect to the game page
        } else if (userData.password !== loginPassword) {
            alert('Incorrect password!');
        } else if (userData.email !== loginEmail) {
            alert('Incorrect or mismatching email!');
        }
    } else {
        alert('User not found. Please register.');
    }
});


// This is to display the current user on the login page//
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