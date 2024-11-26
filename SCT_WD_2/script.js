// Get the required HTML elements
const timerDispaly = document.getElementById("timerDisplay");
const tableBody = document.getElementById("tableBody");
const tableHead = document.getElementById("tableHead");
const playPauseBtn = document.getElementById("playPause-btn");
const rstBtn = document.getElementById("rst-btn");
const recordLapBtn = document.getElementById("recordLap-btn");
const clrLapBtn = document.getElementById("clrLap-btn");

// Initialize necessary variables
let startTime, currentTime, updatedTime, interval;
let lapCounter = 1,
    elapsedTime = 0,
    previousTime = 0;
let timerActive = false;

// Start or stop the timer
function startStopTimer() {
  if (!timerActive) {
    timerActive = true;
    startTime = Date.now() - elapsedTime;
    interval = setInterval(showTime, 1);
    playPauseBtn.innerHTML = "Pause";
    rstBtn.disabled = true;
    recordLapBtn.disabled = false;
  } else {
    timerActive = false;
    clearInterval(interval);
    elapsedTime = Date.now() - startTime;
    playPauseBtn.innerHTML = "Play";
    recordLapBtn.disabled = true;
    rstBtn.disabled = false;
  }
}

// Format time into hours, minutes, seconds, and milliseconds
function formatTime(Time) {
  const Miliseconds = String(Math.floor(Time % 1000)).padStart(3, "0");
  const Seconds = `${String(Math.floor((Time / 1000) % 60)).padStart(2, "0")}:`;
  const Minutes = `${String(Math.floor((Time / 60000) % 60)).padStart(2, "0")}`;
  const Hours = `${String(Math.floor((Time / 3600000) % 24)).padStart(2, "0")}:`;
  return [Miliseconds, Seconds, Minutes, Hours];
}

// Show the updated time on the timer display
function showTime() {
  updatedTime = Date.now() - startTime;
  const formattedTime = formatTime(updatedTime);
  timerDispaly.innerHTML = `<div>${formattedTime[3]}${formattedTime[2]}</div><div class="msDisplay">${formattedTime[1]}${formattedTime[0]}</div>`;
}

// Reset the timer and clear lap data
function resetTimer() {
  clearInterval(interval);
  elapsedTime = 0;
  previousTime = 0;
  lapCounter = 1;
  timerDispaly.innerHTML = '<div>00:00</div><div class="msDisplay">00:000</div>';
  rstBtn.disabled = true;
  recordLapBtn.disabled = true;
  clrLapBtn.disabled = true;
  tableBody.innerHTML = "";
  tableHead.style.display = "none";
}

// Record lap time and display it
function recordLap() {
  clrLapBtn.disabled = false;
  currentTime = Date.now() - startTime - previousTime;
  previousTime += currentTime;
  updatedTime = Date.now() - startTime;
  const formattedLapTime = formatTime(currentTime);
  const formattedTotalTime = formatTime(updatedTime);
  tableHead.style.display = "table-header-group";

  const newRow = document.createElement("tr");
  const LapNo = document.createElement("td");
  const LapTime = document.createElement("td");
  const totalTime = document.createElement("td");

  LapNo.innerHTML = String(lapCounter).padStart(2, 0);
  LapTime.innerHTML = `${formattedLapTime[3]}${formattedLapTime[2]}:${formattedLapTime[1]}${formattedLapTime[0]}`;
  totalTime.innerHTML = `${formattedTotalTime[3]}${formattedTotalTime[2]}:${formattedTotalTime[1]}${formattedTotalTime[0]}`;

  newRow.appendChild(LapNo);
  newRow.appendChild(LapTime);
  newRow.appendChild(totalTime);
  tableBody.insertBefore(newRow, tableBody.firstChild);

  lapCounter++;
}

// Clear all lap times from the display
function clearLap() {
  clrLapBtn.disabled = true;
  tableBody.innerHTML = "";
  tableHead.style.display = "none";
  lapCounter = 1;
}

// Attach event listeners to the buttons
playPauseBtn.addEventListener("click", startStopTimer);
rstBtn.addEventListener("click", resetTimer);
recordLapBtn.addEventListener("click", recordLap);
clrLapBtn.addEventListener("click", clearLap);