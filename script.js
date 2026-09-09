// Konfigurasi Game
const totalRounds = 3;
const colors = ['red', 'blue'];
const colorClasses = { red: 'num-red', blue: 'num-blue' };
const colorNamesIndo = { red: 'MERAH ❤️', blue: 'BIRU 💙' };

let currentRound = 1;
let sequence = [];
let targetColor = '';
let correctAnswer = 0;
let sequenceLength = 100; // Jumlah angka yang muncul per ronde
let displaySpeed = 2000; // Kecepatan muncul angka (ms)

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startGame() {
    currentRound = 1;
    sequenceLength = 5;
    displaySpeed = 1000;
    generateRound();
}

function generateRound() {
    document.getElementById('round-indicator').innerText = `Round ${currentRound} / ${totalRounds}`;
    sequence = [];

    // Naikkan tingkat kesulitan tiap ronde
    if (currentRound === 2) { sequenceLength = 7; displaySpeed = 800; }
    if (currentRound === 3) { sequenceLength = 9; displaySpeed = 600; }

    // Pilih warna target acak untuk ditanyakan di akhir
    targetColor = colors[Math.floor(Math.random() * colors.length)];
    correctAnswer = 0;

    // Generate deret angka dan warna
    for (let i = 0; i < sequenceLength; i++) {
        let num = getRandomInt(1, 9);
        let color = colors[Math.floor(Math.random() * colors.length)];
        sequence.push({ num, color });

        if (color === targetColor) {
            correctAnswer += num;
        }
    }

    showScreen('game-screen');
    playSequence();
}

function playSequence() {
    let display = document.getElementById('disco-display');
    let index = 0;

    // Beri jeda sebentar sebelum angka pertama muncul
    setTimeout(() => {
        let interval = setInterval(() => {
            if (index < sequence.length) {
                let current = sequence[index];
                display.innerText = current.num;
                display.className = colorClasses[current.color];
                index++;
            } else {
                clearInterval(interval);
                display.innerText = "-";
                display.className = "";
                setTimeout(() => {
                    goToAnswerScreen();
                }, 500);
            }
        }, displaySpeed);
    }, 1000);
}

function goToAnswerScreen() {
    document.getElementById('user-answer').value = '';
    document.getElementById('question-text').innerHTML = `Hitung total dari semua angka berwarna <br><span class="${colorClasses[targetColor]}" style="font-size: 1.5rem; font-weight: bold;">${colorNamesIndo[targetColor]}</span>`;
    showScreen('answer-screen');
    document.getElementById('user-answer').focus();
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        checkAnswer();
    }
}

function checkAnswer() {
    let userAnswer = parseInt(document.getElementById('user-answer').value);
    let statusText = document.getElementById('status-text');
    let correctText = document.getElementById('correct-answer-text');
    let nextBtn = document.getElementById('next-btn');

    if (isNaN(userAnswer)) return alert("Masukkan angka terlebih dahulu!");

    if (userAnswer === correctAnswer) {
        statusText.innerText = "CORRECT! 🎉";
        statusText.className = "status-msg correct";
    } else {
        statusText.innerText = "WRONG! ❌";
        statusText.className = "status-msg wrong";
    }

    correctText.innerText = `Jawaban yang benar adalah: ${correctAnswer}`;

    if (currentRound < totalRounds) {
        nextBtn.innerText = "Round Berikutnya";
    } else {
        nextBtn.innerText = "Main Lagi";
    }

    showScreen('result-screen');
}

function nextRound() {
    if (currentRound < totalRounds) {
        currentRound++;
        generateRound();
    } else {
        showScreen('start-screen');
    }
}