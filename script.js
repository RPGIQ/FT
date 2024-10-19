document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("loginForm").addEventListener("submit", function (event) {
        event.preventDefault(); // منع الإرسال الافتراضي
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // تحقق من صحة بيانات تسجيل الدخول (أضف منطقك هنا)
        if (username && password) {
            document.getElementById("loginPage").style.display = "none";
            document.getElementById("mainContent").style.display = "block";
            loadSavedData(); // تحميل البيانات المحفوظة عند تسجيل الدخول
        }
    });

    document.getElementById("saveMatch").addEventListener("click", saveMatch);
    document.getElementById("resetData").addEventListener("click", resetData);
    document.getElementById("undoButton").addEventListener("click", undoLastMatch); // إضافة حدث للزر
});

// قم بإنشاء متغيرات لتخزين النقاط والهدافين
let scorers = {};
let lastMatch = null; // لتخزين آخر مباراة

function loadSavedData() {
    // استرجاع النقاط
    const teams = ["أحمر", "أسود", "أبيض", "أزرق"];
    teams.forEach(color => {
        const points = localStorage.getItem(color + "Points");
        document.getElementById(color + "Points").innerText = points ? points : "0";
    });

    // استرجاع قائمة الهدافين
    const savedScorers = JSON.parse(localStorage.getItem("scorers")) || {};
    scorers = savedScorers;
    updateScorersTable();
}

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

    // تخزين الحالة الحالية للمباراة
    lastMatch = {
        firstTeamGoals: firstTeamGoals,
        secondTeamGoals: secondTeamGoals,
        firstPlayer: firstPlayer,
        secondPlayer: secondPlayer
    };

    // تحديث النقاط
    if (firstTeamGoals > secondTeamGoals) {
        updatePoints("أحمر", 3); // إضافة 3 نقاط للفريق الأول
        updatePoints("أسود", 0); // الفريق الثاني لا يحصل على نقاط
    } else if (firstTeamGoals < secondTeamGoals) {
        updatePoints("أسود", 3); // إضافة 3 نقاط للفريق الثاني
        updatePoints("أحمر", 0); // الفريق الأول لا يحصل على نقاط
    } else {
        // تعادل
        updatePoints("أحمر", 1); // إضافة نقطة للفريق الأول
        updatePoints("أسود", 1); // إضافة نقطة للفريق الثاني
    }

    // إضافة أهداف اللاعبين حسب عدد الأهداف المدخلة
    if (firstTeamGoals > 0) {
        addScorer(firstPlayer, firstTeamGoals); // إضافة أهداف اللاعب الأول
    }
    if (secondTeamGoals > 0) {
        addScorer(secondPlayer, secondTeamGoals); // إضافة أهداف اللاعب الثاني
    }

    // حفظ البيانات في localStorage
    saveDataToLocalStorage();

    // إظهار زر الرجوع
    document.getElementById("undoButton").style.display = "block";

    // إعادة تعيين المدخلات
    resetInputs();
}



function saveDataToLocalStorage() {
    // حفظ النقاط في localStorage
    const teams = ["أحمر", "أسود", "أبيض", "أزرق"];
    teams.forEach(color => {
        const pointsCell = document.getElementById(color + "Points");
        localStorage.setItem(color + "Points", pointsCell.innerText);
    });

    // حفظ قائمة الهدافين في localStorage
    localStorage.setItem("scorers", JSON.stringify(scorers));
}

function undoLastMatch() {
    if (!lastMatch) {
        alert("لا توجد مباراة للتراجع عنها!");
        return;
    }

    // إعادة النقاط بناءً على آخر مباراة
    if (lastMatch.firstTeamGoals > lastMatch.secondTeamGoals) {
        updatePoints("أسود", -1); // إزالة نقطة من الفريق الثاني
    } else if (lastMatch.firstTeamGoals < lastMatch.secondTeamGoals) {
        updatePoints("أحمر", -1); // إزالة نقطة من الفريق الأول
    } else {
        // تعادل
        if (lastMatch.firstTeamGoals === 0) {
            // تعادل 0-0: لا إزالة نقاط
            updatePoints("أحمر", -1);
            updatePoints("أسود", -1);
        } else {
            // تعادل مع أهداف
            updatePoints("أحمر", -1);
            updatePoints("أسود", -1);
        }
    }

    // إزالة أهداف اللاعبين حسب عدد الأهداف المدخلة
    if (lastMatch.firstTeamGoals > 0) {
        removeScorer(lastMatch.firstPlayer, lastMatch.firstTeamGoals); // إزالة أهداف اللاعب الأول
    }
    if (lastMatch.secondGoals > 0) {
        removeScorer(lastMatch.secondPlayer, lastMatch.secondTeamGoals); // إزالة أهداف اللاعب الثاني
    }

    // إعادة تعيين الحالة الأخيرة
    lastMatch = null;

    // إخفاء زر الرجوع
    document.getElementById("undoButton").style.display = "none";

    // إعادة تعيين الجدول
    updateScorersTable();

    // حفظ البيانات في localStorage
    saveDataToLocalStorage();
}

function updatePoints(teamColor, adjustment = 1) {
    const teamPointsCell = document.getElementById(teamColor + "Points");
    let currentPoints = parseInt(teamPointsCell.innerText);
    teamPointsCell.innerText = currentPoints + adjustment; // إضافة أو إزالة نقطة
}

function addScorer(player, goals) {
    if (scorers[player]) {
        scorers[player] += goals; // إضافة أهداف جديدة
    } else {
        scorers[player] = goals; // تعيين أهداف اللاعب
    }
    updateScorersTable();
}

function removeScorer(player, goals) {
    if (scorers[player]) {
        scorers[player] -= goals; // إزالة أهداف
        if (scorers[player] <= 0) {
            delete scorers[player]; // حذف اللاعب إذا لم يكن لديه أهداف
        }
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
        localStorage.removeItem(color + "Points"); // إزالة البيانات من localStorage
    });

    // إعادة تعيين قائمة الهدافين
    scorers = {};
    updateScorersTable();
    localStorage.removeItem("scorers"); // إزالة البيانات من localStorage
}
