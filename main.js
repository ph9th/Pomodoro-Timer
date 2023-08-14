//buttons
const startButton = document.querySelector('#btn-front-start');
const resetButton = document.querySelector('#btn-front-reset');
const toggleButton = document.querySelector('.btn-toggle');
 
//timer variables
const timerText = document.querySelector('#timer-text'); 
let startTime;
let stopTime;
let timerIsRunning = false;
var timer;
const TOTAL_TIME = 1500000;
let remainingTime = 1500000; //1500000 ms = 25 min
let currentDate = new Date(Date.now()); //keep track of time of day
let currentHour = currentDate.getHours();
let sessionType = 'focus';
let sessionCount = 0;

const SHORT_BREAK_TIME = 300000; //Short break time in ms; 5 min
const LONG_BREAK_TIME = 900000; //Long break time in ms; 15 min


//tomato color
var tomatoColor = document.getElementById("tomato-fill");
var colorTransition = document.querySelector(".color-transition");


function updateTime() {
    // check time of day every 10min
    setInterval(() => {
      currentDate = new Date(Date.now());
      currentHour = currentDate.getHours();
    }, 600000);
  }

function startTimer(secondsLeft) {
  console.log("start");
  let bellSound = new Audio('./sounds/bell.mp3');
    tomatoColor.classList.add("color-transition");
    
    let ms = secondsLeft * 1000;
    startTime = new Date().getTime();
    timerIsRunning = true;
    startButton.innerHTML = 'Pause';

    timer = setInterval(() => {
      remainingTime = Math.max(0, ms - (new Date().getTime()-startTime));
      updateTimer();
      
      if(sessionType==='focus'){
        //change color
        if(remainingTime > TOTAL_TIME/2){
          changeColor('yellow');
        } else if(remainingTime < TOTAL_TIME/2){
          changeColor('red');
}
      }
      
      displayCurrentTask();
      
      //Stop Timer
      //Switch session type
      if(remainingTime <= 500) {
          bellSound.play();
          stopTime = new Date().getTime();
          clearInterval(timer);
          resumeTimer

          if(sessionType === 'focus'){
            sessionCount++;
          }
          switchSession();

        }

    }, 250);
}

function pauseTimer(){
    console.log("pause");
    if(timerIsRunning) {
        clearInterval(timer);
        startButton.innerHTML = 'Resume';
        timerIsRunning = false;

        var currColor = window.getComputedStyle(tomatoColor).getPropertyValue("fill");
        tomatoColor.style.fill = currColor;
   
    }
}

function resumeTimer() {
    console.log("resume");
    if(!timerIsRunning) {
      startTimer(remainingTime/1000);
      startButton.innerHTML = 'Pause';
      timerIsRunning = true;

      tomatoColor.classList.add("color-transition");
    }

  }

function pauseOrResumeTimer() {
    if(timerIsRunning === false) {
    if(remainingTime === 0) {
        startTimer(remainingTime/1000);
    } else {
        resumeTimer();
    }
    } else {
    pauseTimer();
    }
}

const delay = ms => new Promise(res => setTimeout(res, ms));
const delayResetTimer = async () => {
  await delay(1000);
  resetTimer();
};

function resetTimer(){
    console.log("reset");
    stopTime = new Date().getTime(); 
    clearInterval(timer);
    timerIsRunning = false;
    remainingTime = TOTAL_TIME;
    startButton.innerHTML = 'Start';
    tomatoColor.classList.remove("color-transition");
    changeColor('green');
    sessionType = 'focus';
    changeSessionText('focus');
    updateTimer();
    
}

function updateTimer() {
    const secondsLeft = remainingTime/1000;
    let hour = Math.floor((remainingTime/1000)/3600);
    let min = parseInt((secondsLeft/60) % 60);
    let seconds = Math.floor(secondsLeft % 60);
    min = (min < 10 ? "0" : "") + min;
    seconds = (seconds < 10 ? "0" : "") + seconds;
    timerText.innerHTML = hour > 0 ? hour + ":" + min +":" + seconds : min +":" + seconds;
    if(timerIsRunning) {
        timerText.innerHTML = hour > 0 ? hour + ":" + min +":" + seconds : min +":" + seconds;
    }
}

function changeSessionText(type){
  document.getElementById("sessionTextPath").textContent = type;
}

// Switch between focus and break session
function switchSession(){
  if(sessionType == 'focus'){
    sessionType = 'break';
    //Change session text
    changeSessionText('break');
    if(sessionCount % 4 == 0) {
      remainingTime = LONG_BREAK_TIME;
      sessionCount = 0;
    } else {
      remainingTime = SHORT_BREAK_TIME;
    }
  }
  else if(sessionType == 'break'){
    sessionType = 'focus';
    //Change session text
    changeSessionText('focus');
    remainingTime = TOTAL_TIME;
    changeColor('green');
  }

  setTimeout(function() {
    startTimer(remainingTime/1000);
  }, 2000);

  
}

// Start clock if button is pressed
startButton.addEventListener('click', () => {
    pauseOrResumeTimer();
});

resetButton.addEventListener('click', () => {
    resetTimer();
});


window.addEventListener('load',updateTimer);
window.addEventListener('load', updateTime);


// Task list functions

function toggleList() {
    var list = document.getElementsByClassName("task-list-container");
    var icon = document.getElementById("toggle-icon");
    list[0].classList.toggle("hide");
    if(list[0].classList.contains("hide")){
      icon.className = "fa-solid fa-angle-up";
    }else {
      icon.className = "fa-solid fa-angle-down";
    };
  };

toggleButton.addEventListener('click', () => {
    toggleList();
});


//change tomato color gradient

function changeColor(timerState) {
        //set duration
  let remainingTimeChar;
  switch(timerState){
    case 'green':
      tomatoColor.style.fill = '#5B8C5A';
      break;
    case 'yellow':
      remainingTimeChar = String((remainingTime-(TOTAL_TIME/2))/1000) + "s";
      $('.color-transition').css('transitionDuration', remainingTimeChar);

      tomatoColor.style.fill = '#F7B23B';
      break;
    case 'red':
      remainingTimeChar = String(remainingTime/1000 + "s");
      $('.color-transition').css('transitionDuration', remainingTimeChar);

      tomatoColor.style.fill = '#DB3A34';
      break;
    default:
      tomatoColor.style.fill = '#DB3A34';
      break;
  }
}


function toggleTextDecoration(checkbox){
  if(checkbox.childNodes[1].checked){
    checkbox.nextElementSibling.classList.add('text-decoration');
  }else {
    checkbox.nextElementSibling.classList.remove('text-decoration');
  }
}

//display current task
function displayCurrentTask() {
 
    var currTaskText = document.getElementById("current-task");
    var ul = document.getElementById("task-ul");
    var items = ul.getElementsByTagName("li");
    for (let i = 0; i < items.length; i++) {
      let itemCheckbox = items[i].getElementsByClassName("li-checkbox")[0];
      let checked = itemCheckbox.checked;

      if(!checked){
        currTaskText.innerHTML = items[i].getElementsByClassName("task-text")[0].innerHTML;
        break;
      };
  }
}

function checkTasks(element){
  var id = element.id;

}

function crossTask(input){
  if(input.checked){

  }
}

function toggleMode(){
  
  document.body.classList.toggle("dark-mode");
  var moon = document.getElementById("moon");
  moon.classList.toggle('moon-dark-mode');

  var sessionText = document.getElementById("sessionText");
  sessionText.classList.toggle('sessionText-dark-mode');

}

