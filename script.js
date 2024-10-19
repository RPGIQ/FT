document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("loginForm").addEventListener("submit", function (event) {
        event.preventDefault(); // منع الإرسال الافتراضي
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // تحقق من صحة بيانات تسجيل الدخول (أضف منطقك هنا)
        if (username && password) {
            document.getElementById("loginPage").style.display = "none";
            document.getElementById("mainContent").style.display = "block";
        }
    });

    document.getElementById("saveMatch").addEventListener("click", saveMatch);
    document.getElementById("resetData").addEventListener("click", resetData);
});

let scorers = {};

function saveMatch() {
    const firstTeamGoals = parseInt(document.getElementById("firstTeamGoals").value);
    const secondTeamGoals = parseInt(document.getElementById("secondTeamGoals").value);
    
    const firstPlayer = document.getElementById("firstTeamPlayer").value;
    const secondPlayer = document.getElementById("secondTeamPlayer").value;

    // تحقق من أن الأهداف صحيحة
    if (isNaN(firstTeamGoals) || isNaN(secondTeamGoals)) {
        alert("يرجى إدخال عدد صحيح من الأهداف");
        return;
    }

    // تحديث النقاط
    if (firstTeamGoals > secondTeamGoals) {
        updatePoints("أحمر"); // الفريق الأول
    } else if (firstTeamGoals < secondTeamGoals) {
        updatePoints("أسود"); // الفريق الثاني
    } else {
        // تعادل (يشمل 0-0 أو غيرها)
        if (firstTeamGoals === 0) {
            // تعادل 0-0: لا إضافة أهداف
            updatePoints("أحمر");
            updatePoints("أسود");
        } else {
            // تعادل مع أهداف (1-1 أو أكثر)
            updatePoints("أحمر");
            updatePoints("أسود");
            addScorer(firstPlayer);
            addScorer(secondPlayer);
        }
    }

    // إضافة أهداف اللاعبين إذا كانت هناك أهداف
    if (firstTeamGoals > 0) {
        addScorer(firstPlayer);
    }
    if (secondTeamGoals > 0) {
        addScorer(secondPlayer);
    }

    // إعادة تعيين المدخلات
    resetInputs();
}

function updatePoints(teamColor) {
    const teamPointsCell = document.getElementById(teamColor + "Points");
    let currentPoints = parseInt(teamPointsCell.innerText);
    teamPointsCell.innerText = currentPoints + 1; // إضافة نقطة لكل فريق
}

function addScorer(player) {
    if (scorers[player]) {
        scorers[player]++;
    } else {
        scorers[player] = 1;
    }
    updateScorersTable();
}

function updateScorersTable() {
    const scorersBody = document.getElementById("scorersBody");
    scorersBody.innerHTML = ""; // مسح الجدول قبل التحديث

    for (const player in scorers) {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${player}</td><td>${scorers[player]}</td>`;
        scorersBody.appendChild(row);
    }
}

function resetInputs() {
    document.getElementById("firstTeamGoals").value = "";
    document.getElementById("secondTeamGoals").value = "";
    document.getElementById("firstTeamPlayer").selectedIndex = 0;
    document.getElementById("secondTeamPlayer").selectedIndex = 0;
}

function resetData() {
    // إعادة تعيين النقاط
    const teams = ["أحمر", "أسود", "أبيض", "أزرق"];
    teams.forEach(color => {
        document.getElementById(color + "Points").innerText = "0";
    });

    // إعادة تعيين قائمة الهدافين
    scorers = {};
    updateScorersTable();
}
