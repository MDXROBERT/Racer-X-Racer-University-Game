document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.random-image');

    images.forEach(img => {
        moveRandomly(img);
    });
});


function moveRandomly(element) {
    const maxX = window.innerWidth - element.clientWidth;
    const maxY = window.innerHeight - element.clientHeight;

    setInterval(() => {
        const newX = Math.random() * maxX;
        const newY = Math.random() * maxY;

        element.style.left = `${newX}px`;
        element.style.top = `${newY}px`;
    }, 200);  // This is to adjust the speed of the movement of the images //
}



// This is to display the current user on the home page //
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

// Logout Function
function logout() {
    // Set the current user in local storage to "Guest"
    localStorage.setItem('currentUser', 'Guest');

    
    const userDisplayElement = document.getElementById('userDisplay');
    if (userDisplayElement) {
        userDisplayElement.innerText = 'Current user : Guest';
    }

    alert('You are now logged out. You can continue playing as a guest.');


}


document.getElementById('logoutButton').addEventListener('click', logout);

// Display Current User 
function displayCurrentUser() {
    const currentUser = localStorage.getItem('currentUser') || 'Guest';
    const userDisplayElement = document.getElementById('userDisplay');
    if (userDisplayElement) {
        userDisplayElement.innerText = `Current user : ${currentUser}`;
    }
}

// Call displayCurrentUser on page load
window.onload = function () {
    displayCurrentUser();
};
