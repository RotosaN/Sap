let userName = localStorage.getItem("userName") || "";
let correctAnswers = parseInt(localStorage.getItem("correctAnswers")) || 0;
let totalTime = parseFloat(localStorage.getItem("totalTime")) || 0;

if (!userName) {
    userName = prompt("ユーザー名を入力してください:");
    if (userName) {
        localStorage.setItem("userName", userName);
    }
}
document.getElementById("correct-count").textContent = `${correctAnswers}`;
document.getElementById("total-time").textContent = `${totalTime.toFixed(1)} 秒`;

const socket = new WebSocket("wss://eastern-almondine-backbone.glitch.me"); // WebSocketサーバーのURLを指定

let startTime, endTime;

console.log("B")

socket.onerror = function(event) {
    console.error("WebSocket error observed:", event);
};

socket.onopen = function(event) {
    console.log("WebSocket connection established");
};

socket.onmessage = function(event){

    const data = JSON.parse(event.data);

    if (data.type === "start_quiz") {
        document.querySelectorAll(".answer-btn").forEach((btn) => {
            btn.disabled = false;
            btn.classList.add("enabled");
        });

        startTime = Date.now();
        setTimeout(() => {
            document.querySelectorAll(".answer-btn").forEach((btn) => {
                btn.disabled = true;
                btn.classList.remove("enabled");
            });
        }, data.timeLimit * 1000);

        setTimeout(() => {
            if (parseInt(localStorage.getItem("lastAnswer")) === data.correctAnswer) {
                correctAnswers++;
                localStorage.setItem("correctAnswers", correctAnswers);
                document.getElementById("correct-count").textContent = `${correctAnswers}`;
            }
        }, data.timeLimit * 1000 + 5000);
    }
};

document.querySelectorAll(".answer-btn").forEach((btn, index) => {
    btn.addEventListener("click", () => {
        if (!btn.disabled) {
            endTime = Date.now();
            const elapsedTime = (endTime - startTime) / 1000;
            totalTime += elapsedTime;

            localStorage.setItem("totalTime", totalTime);
            localStorage.setItem("lastAnswer", index);

            document.getElementById("total-time").textContent = `${totalTime.toFixed(1)} 秒`;

            document.querySelectorAll(".answer-btn").forEach((btn) => {
                btn.disabled = true;
                btn.classList.remove("enabled");
            });
        }
    });
});