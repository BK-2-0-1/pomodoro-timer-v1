// Переменные для отслеживания состояния таймера
let isPaused = false;
let isWorkPhase = true;
let workDuration = 25 * 60;
let breakDuration = 5 * 60;
let timeRemaining = workDuration;
let timerInterval = null;

// Ссылки на элементы
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");
const workInput = document.getElementById("work-duration");
const breakInput = document.getElementById("break-duration");
const togglePhaseBtn = document.getElementById("toggle-phase-btn");

// Ссылки на аудиоэлементы
const startSound = document.getElementById("start-sound");
const endSound = document.getElementById("end-sound");

// Функция для форматирования времени
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// Функция обновления дисплея таймера
function updateDisplay() {
  timerDisplay.textContent = formatTime(timeRemaining);
}

// Функция обновления длительности рабочего и перерывного времени
function updateDurations() {
  workDuration = parseInt(workInput.value) * 60;
  breakDuration = parseInt(breakInput.value) * 60;

  // Если таймер не запущен, обновляем отображаемое время
  if (!timerInterval) {
    timeRemaining = isWorkPhase ? workDuration : breakDuration;
    updateDisplay();
  }
}

// Функция запуска таймера
function startTimer() {
  if (timerInterval) return; // Предотвращаем повторный запуск

  if (isWorkPhase) {
    startSound.play(); // Звук для начала работы
  }

  updatePhaseStyle(); // Обновляем стиль фазы при старте

  timerInterval = setInterval(() => {
    if (timeRemaining > 0 && !isPaused) {
      timeRemaining--;
      updateDisplay();
    } else if (timeRemaining === 0) {
      clearInterval(timerInterval);
      timerInterval = null;

      if (isWorkPhase) {
        endSound.play();
      } // Воспроизводим звук завершения фазы только по окончании рабочего времени

      alert(isWorkPhase ? "Время перерыва!" : "Время работы!");
      isWorkPhase = !isWorkPhase; // Переход между фазами
      timeRemaining = isWorkPhase ? workDuration : breakDuration;
      updatePhaseStyle(); // Обновляем стиль фазы при переключении
      startTimer(); // Запуск следующей фазы
    }
  }, 1000);
}

// Функция для обновления стиля фазы
function updatePhaseStyle() {
  if (isWorkPhase) {
    timerDisplay.classList.add("work-phase");
    timerDisplay.classList.remove("break-phase");
    console.log("Рабочая фаза: класс 'work-phase' добавлен");
  } else {
    timerDisplay.classList.add("break-phase");
    timerDisplay.classList.remove("work-phase");
    console.log("Перерыв: класс 'break-phase' добавлен");
  }
}

// Функция паузы таймера
function pauseTimer() {
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? "Resume" : "Pause";
}

// Функция сброса таймера
function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  isPaused = false;
  isWorkPhase = true;
  updateDurations(); // Обновляем длительности при сбросе
  timeRemaining = workDuration;
  updateDisplay();
  pauseBtn.textContent = "Pause";
}

// Функция переключения между рабочей фазой и перерывом

function togglePhase() {
  clearInterval(timerInterval); // Остановим текущий таймер
  timerInterval = null;
  isPaused = false;

  // Переключаем фазу
  isWorkPhase = !isWorkPhase;
  timeRemaining = isWorkPhase ? workDuration : breakDuration;
  updateDisplay();
  updatePhaseStyle(); // Обновляем стиль фазы

  // Запускаем таймер сразу в новой фазе
  startTimer();
}

// Обработчики событий
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
workInput.addEventListener("input", updateDurations);
breakInput.addEventListener("input", updateDurations);
togglePhaseBtn.addEventListener("click", togglePhase);

// Начальная установка дисплея
updateDisplay();
