'use strict'


const LIVE_IMG = '❤️'
const SMILY_IMG = '😀'
const LOSE_IMG = '😭'
const WIN_IMG = '😎'
const HINT_IMG = '💡'


var lives = 3
var startTime

function onInitDetails(){
    createLives()
    createBtnLevel()
    creatSmily()
    createTimer()
   
}



function selectLevel(i){
    level = gLevel[i]
    flagsCount = level.MINES
    clearInterval(gGame.secsPassed)
    restartGame()
}

function createBtnLevel(){
    var btnVal = ''
    for (var i = 0; i < 3; i++) {
     btnVal += `<button onclick="selectLevel(${i})">${gLevel[i].LEVEL}</button>`     
}  
document.querySelector('.levels-container').innerHTML = btnVal
}

function createFlagCounter(){ 
document.querySelector('.flag-counter').innerHTML = `Flags: ${flagsCount}`
}

function createTimer() {
    const elapsedTime = (Date.now() - startTime) /1000
    const formattedTime = elapsedTime? elapsedTime.toFixed(0).padStart(3, '0') : ' 000'
    document.querySelector('.timer').innerHTML = `Time: ${formattedTime}`
}

function createLives(){ 
    var livesVal = '' 
    for (var i = 0; i < lives; i++) {
        livesVal += `<div class="live">${LIVE_IMG}</div>`    
        
}  
document.querySelector('.lives-container').innerHTML = livesVal
}


function creatSmily(gameStatus){ 
    var smileyFace = SMILY_IMG   

    switch(gameStatus){
        case 'normal':
            smileyFace = SMILY_IMG
            break
        case 'lose':
            smileyFace = LOSE_IMG 
            break  
        case 'win':
            smileyFace = WIN_IMG 
            break   
        default:
            smileyFace = SMILY_IMG    

    }
    var smilyVal = '' 
    smilyVal += `<div class="smily"onclick="restartGame()">${smileyFace}</div>`

    document.querySelector('.smily').innerHTML = smilyVal
}


