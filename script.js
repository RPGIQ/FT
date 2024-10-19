document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    if (username === "user" && password === "12") {
        document.getElementById("loginPage").style.display = "none";
        document.getElementById("mainContent").style.display = "block";
        loadStandings();
        loadScorers();
    } else {
        alert("اسم المستخدم أو كلمة المرور غير صحيحة");
    }
});

document.getElementById("saveMatch").addEventListener("click", saveMatch);
document.getElementById("resetData").addEventListener("click", resetData);

function saveMatch() {
    const firstPlayer = document.getElementById("firstTeamPlayer").value;
    const firstTeamGoals = parseInt(document.getElementById("firstTeamGoals").value);
    const secondPlayer = document.getElementById("secondTeamPlayer").value;
    const secondTeamGoals = parseInt(document.getElementById("secondTeamGoals").value);

    if (!firstPlayer || !secondPlayer || isNaN(firstTeamGoals) || isNaN(secondTeamGoals)) {
        alert("يرجى ملء جميع الحقول");
        return;
    }

    // Add points for winning team or draw
    let winnerColor = '';
    if (firstTeamGoals > secondTeamGoals) {
        winnerColor = firstPlayer.split(': ')[1]; // Get the color of the winning player
    } else if (firstTeamGoals < secondTeamGoals) {
        winnerColor = secondPlayer.split(': ')[1];
    }

    // Update points
    updatePoints(winnerColor, firstTeamGoals, secondTeamGoals);

    // Update scorers only if there's a goal
    if (firstTeamGoals > 0 || secondTeamGoals > 0) {
        if (firstTeamGoals > 0) {
            updateScorers(firstPlayer, firstTeamGoals);
        }
        if (secondTeamGoals > 0) {
            updateScorers(secondPlayer, secondTeamGoals);
        }
    }

    // Save to localStorage
    saveToLocalStorage();
}

function updatePoints(winnerColor, firstTeamGoals, secondTeamGoals) {
    if (winnerColor) {
        const pointsCell = document.getElementById(`${winnerColor}Points`);
        if (pointsCell) {
            pointsCell.innerText = parseInt(pointsCell.innerText) + 3; // 3 points for win
        }
    } else if (firstTeamGoals === secondTeamGoals && firstTeamGoals > 0) {
        // If it’s a draw with goals
        const colors = [firstPlayer.split(': ')[1], secondPlayer.split(': ')[1]];
        colors.forEach(color => {
            const pointsCell = document.getElementById(`${color}Points`);
            if (pointsCell) {
                pointsCell.innerText = parseInt(pointsCell.innerText) + 1; // 1 point for draw
            }
        });
    }
}

function updateScorers(player, goals) {
    const playerName = player.split(': ')[0];
    let scorerRow = document.querySelector(`#scorersBody tr[data-player="${playerName}"]`);

    if (scorerRow) {
        const goalsCell = scorerRow.querySelector('td:nth-child(2)');
        goalsCell.innerText = parseInt(goalsCell.innerText) + goals;
    } else {
        scorerRow = document.createElement("tr");
        scorerRow.setAttribute("data-player", playerName);
        scorerRow.innerHTML = `<td>${playerName}</td><td>${goals}</td>`;
        document.getElementById("scorersBody").appendChild(scorerRow);
    }
}

function loadStandings() {
    const standings = JSON.parse(localStorage.getItem("standings")) || { "أحمر": 0, "أسود": 0, "أبيض": 0, "أزرق": 0 };

    // تحويل الكائن إلى مصفوفة لترتيب الفرق
    const standingsArray = Object.keys(standings).map(color => ({
        color: color,
        points: standings[color]
    }));

    // ترتيب الفرق حسب النقاط (الأكبر أولاً)
    standingsArray.sort((a, b) => b.points - a.points);

    // تحديث نقاط الفرق في الجدول
    standingsArray.forEach(({ color, points }) => {
        document.getElementById(`${color}Points`).innerText = points;
    });
}

function loadScorers() {
    const scorers = JSON.parse(localStorage.getItem("scorers")) || [];
    scorers.forEach(scorer => {
        const scorerRow = document.createElement("tr");
        scorerRow.setAttribute("data-player", scorer.player);
        scorerRow.innerHTML = `<td>${scorer.player}</td><td>${scorer.goals}</td>`;
        document.getElementById("scorersBody").appendChild(scorerRow);
    });
}

function saveToLocalStorage() {
    const standings = {
        "أحمر": parseInt(document.getElementById("أحمرPoints").innerText),
        "أسود": parseInt(document.getElementById("أسودPoints").innerText),
        "أبيض": parseInt(document.getElementById("أبيضPoints").innerText),
        "أزرق": parseInt(document.getElementById("أزرقPoints").innerText)
    };
    localStorage.setItem("standings", JSON.stringify(standings));

    const scorers = [];
    document.querySelectorAll("#scorersBody tr").forEach(row => {
        scorers.push({
            player: row.cells[0].innerText,
            goals: parseInt(row.cells[1].innerText)
        });
    });
    localStorage.setItem("scorers", JSON.stringify(scorers));
}

function resetData() {
    localStorage.removeItem("standings");
    localStorage.removeItem("scorers");
    location.reload();
}
