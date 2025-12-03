
window.onload = function () {
    displayLeaderboard();
};
// This is to display the leaderboard on the leaderboard page //
function displayLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const leaderboardTbody = document.getElementById('leaderboard-tbody');

    // Clear the existing rows
    leaderboardTbody.innerHTML = '';

    // Add the new rows
    leaderboard.forEach((entry, index) => {
        const tr = document.createElement('tr');

        const rankTd = document.createElement('td');
        rankTd.textContent = index + 1;

        const userTd = document.createElement('td');
        userTd.textContent = entry.user;

        const scoreTd = document.createElement('td');
        scoreTd.textContent = entry.score;

        tr.appendChild(rankTd);
        tr.appendChild(userTd);
        tr.appendChild(scoreTd);

        leaderboardTbody.appendChild(tr);
    });
}




