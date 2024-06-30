// Constants
let TOTAL_TIME = 1_500_000 // 1500000 ms = 25 minutes
let SHORT_BREAK_TIME = 300_000 // 5 minutes
let LONG_BREAK_TIME = 900_000 // 15 minutes

// Get elements
const startButton = document.querySelector('#btn-front-start')
const resetButton = document.querySelector('#btn-front-reset')
const toggleButton = document.querySelector('.btn-toggle')
const timerText = document.querySelector('#timer-text') // displayed timer text
const tomatoColor = document.getElementById('tomato-fill') // tomato color

// Timer variables
let startTime
let stopTime
let timerIsRunning = false
let timer
let remainingTime = TOTAL_TIME
let currentDate = new Date() //keep track of time of day
let currentHour = currentDate.getHours()
let sessionType = 'focus'
let sessionCount = 0

// Audio
const bellSound = new Audio('./sounds/bell.mp3')

// Update time of day every 10 minutes
function updateTime() {
  setInterval(() => {
    currentDate = new Date()
    currentHour = currentDate.getHours()
  }, 600_000)
}

// Format time as HH:MM:SS
function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`
}

// Start timer
function startTimer(secondsLeft) {
  tomatoColor.classList.add('color-transition')
  const ms = secondsLeft * 1000
  startTime = new Date().getTime()
  timerIsRunning = true
  startButton.innerHTML = 'Pause'

  timer = setInterval(() => {
    remainingTime = Math.max(0, ms - (new Date().getTime() - startTime))
    updateTimer()

    if (sessionType === 'focus') {
      if (remainingTime > TOTAL_TIME / 2) {
        changeColor('yellow')
      } else if (remainingTime < TOTAL_TIME / 2) {
        changeColor('red')
      }
    }

    displayCurrentTask()

    //Switch session type
    if (remainingTime > 500) {
      return
    }
    bellSound.play()
    stopTime = new Date().getTime()
    clearInterval(timer)

    if (sessionType === 'focus') {
      sessionCount++
    }
    switchSession()
  }, 250)
}

// Pause timer
function pauseTimer() {
  if (!timerIsRunning) {
    return
  }
  clearInterval(timer)
  startButton.innerHTML = 'Resume'
  timerIsRunning = false

  // const currColor = window.getComputedStyle(tomatoColor).getPropertyValue("fill");
  // tomatoColor.style.fill = currColor;
}

// Resume timer
function resumeTimer() {
  if (timerIsRunning) {
    return
  }
  startTimer(remainingTime / 1000)
  startButton.innerHTML = 'Pause'
  timerIsRunning = true
  tomatoColor.classList.add('color-transition')
}

// Toggle between pause and resume
function pauseOrResumeTimer() {
  if (timerIsRunning) {
    pauseTimer()
  } else if (remainingTime === 0) {
    startTimer(remainingTime / 1000)
  } else {
    resumeTimer()
  }
}

// Reset timer
function resetTimer() {
  stopTime = new Date().getTime()
  clearInterval(timer)
  timerIsRunning = false
  remainingTime = TOTAL_TIME
  startButton.innerHTML = 'Start'
  tomatoColor.classList.remove('color-transition')
  changeColor('green')
  sessionType = 'focus'
  changeSessionText('focus')
  updateTimer()
}

// Update timer text
function updateTimer() {
  timerText.textContent = formatTime(remainingTime)
}

// Update session text
function changeSessionText(type) {
  document.getElementById('sessionTextPath').textContent = type
}

// Switch between focus and break session
function switchSession() {
  if (sessionType == 'focus') {
    sessionType = 'break'
    changeSessionText('break')
    if (sessionCount % 4 == 0) {
      remainingTime = LONG_BREAK_TIME
      sessionCount = 0
    } else {
      remainingTime = SHORT_BREAK_TIME
    }
  } else if (sessionType == 'break') {
    sessionType = 'focus'
    changeSessionText('focus')
    remainingTime = TOTAL_TIME
    changeColor('green')
  }

  setTimeout(() => {
    startTimer(remainingTime / 1000)
  }, 2000)
}

// Event listeners
startButton.addEventListener('click', () => {
  pauseOrResumeTimer()
})

resetButton.addEventListener('click', () => {
  resetTimer()
})

toggleButton.addEventListener('click', () => {
  const list = document.querySelector('.task-list-container')
  list.classList.toggle('hide')
  const icon = document.getElementById('toggle-icon')
  icon.className = list.classList.contains('hide')
    ? 'fa-solid fa-angle-up'
    : 'fa-solid fa-angle-down'
})

window.addEventListener('load', () => {
  updateTimer()
  updateTime()
})

// Task list functions

// Display current task
function displayCurrentTask() {
  const currTaskText = document.getElementById('current-task')
  const ul = document.getElementById('task-list')
  const items = ul.getElementsByTagName('li')

  for (const item of items) {
    const itemCheckbox = item.querySelector('.li-checkbox')
    const checked = itemCheckbox.checked
    const taskText = item.querySelector('.task-text').textContent

    if (!checked && taskText.trim() !== '') {
      currTaskText.textContent = taskText
      break
    }
  }
}

//Toggle tomato color based on time remaining
function toggleColorTransition(timerState) {
  let remainingTimeChar

  switch (timerState) {
    case 'green':
      tomatoColor.style.fill = '#5B8C5A'
      break
    case 'yellow':
      remainingTimeChar = `${String((remainingTime - TOTAL_TIME / 2) / 1000)}s`
      $('.color-transition').css('transitionDuration', remainingTimeChar)

      tomatoColor.style.fill = '#F7B23B'
      break
    case 'red':
      remainingTimeChar = String(`${remainingTime / 1000}s`)
      $('.color-transition').css('transitionDuration', remainingTimeChar)

      tomatoColor.style.fill = '#DB3A34'
      break
    default:
      tomatoColor.style.fill = '#DB3A34'
      break
  }
}

// Initial UI setup
function initializeUI() {
  updateTimer()
  updateTime()
  changeColor('green')
  changeSessionText('focus')
}

// Change tomato color gradient
function changeColor(timerState) {
  tomatoColor.style.transitionDuration = '0s'
  toggleColorTransition(timerState)
}

// Toggle dark mode
function toggleMode() {
  document.body.classList.toggle('dark-mode')
  const moon = document.getElementById('moon')
  moon.classList.toggle('moon-dark-mode')

  const sessionText = document.getElementById('sessionText')
  sessionText.classList.toggle('sessionText-dark-mode')

  const btn = document.getElementById('btn-reset')
  btn.classList.toggle('btn-dark-mode')
}

initializeUI()

function toggleTextDecoration(checkbox) {
  if (checkbox.childNodes[1].checked) {
    checkbox.nextElementSibling.classList.add('text-decoration')
  } else {
    checkbox.nextElementSibling.classList.remove('text-decoration')
  }
}

class TaskItem {
  constructor(text, isChecked = false) {
    this.text = text
    this.isChecked = isChecked
  }

  render() {
    const li = document.createElement('li')
    li.classList.add('task')
    li.innerHTML = `
      <label>
        <input class="li-checkbox" type="checkbox" ${this.isChecked ? 'checked' : ''
      }>
        <span class="checkmark"></span>
      </label>
      <div class="task-text-container">
        <span class="task-text" contenteditable="true" data-placeholder="Enter your task">${this.text
      }</span>
      </div>
    `

    const checkbox = li.querySelector('.li-checkbox')
    const taskText = li.querySelector('.task-text')

    checkbox.addEventListener('change', () => {
      this.isChecked = checkbox.checked
      taskText.classList.toggle('completed', this.isChecked)
    })

    taskText.addEventListener('input', () => {
      this.text = taskText.textContent
    })

    taskText.addEventListener('keypress', evt => {
      if (evt.which === 13) {
        evt.preventDefault()
      }
    })

    return li
  }
}

function addTaskToList(text, isChecked = false) {
  const taskItem = new TaskItem(text, isChecked)
  const taskList = document.getElementById('task-list')
  taskList.appendChild(taskItem.render())
}

addTaskToList('')
addTaskToList('')
addTaskToList('')
addTaskToList('')

function toggleSettings() {
  const div = document.getElementById('settings')
  div.classList.toggle('fade')
  const outerDiv = document.querySelector('.settings-container')
  outerDiv.classList.toggle('blur')
  outerDiv.classList.toggle('fade')
}

function saveSettings() {
  const pomodoro = document.getElementById('pomodoro')
  TOTAL_TIME = pomodoro.value * 60_000
  const shortBreak = document.getElementById('short-break')
  SHORT_BREAK_TIME = shortBreak.value * 60_000
  const longBreak = document.getElementById('long-break')
  LONG_BREAK_TIME = longBreak.value * 60_000

  resetTimer()

  toggleSettings()
}
