'use strict'
const MINE ='MINE'
const FLAG = 'FLAG'

const MINE_IMG = '💣'
const FLAG_IMG = '🚩'
const LIVE_IMG = '❤️'
const SMILY_IMG = '😀'
const LOSE_IMG = '😭'
const WIN_IMG = '😎'
var gBoard //The model
var minesLoc = []

//This is an object by which theboard size is set 
//TODO need to check again if i should put it in a function or here 

const gLevel = [
   {  
        LEVEL: 'Beginner',  
        SIZE: 4,
        MINES: 2
    },
    {
        LEVEL: 'Medium',  
        SIZE: 8,
        MINES: 14
    },
    {
        LEVEL: 'Expert',  
        SIZE: 12,
        MINES: 32
    }
]

var level = gLevel[0]
var lives = 3
var isFirstClick = true
var setTime = 0
var flagsCount = level.MINES

//This is an object in which youcan keep and update thecurrent game state:
var gGame = {
    isOn: false,  //isOn: Boolean, when true welet the user play
    shownCount: 0,//shownCount: How many cells are shown
    markedCount: 0,//markedCount: How many cells are marked (with a flag)
    secsPassed: 0 //secsPassed: How many seconds passed 
}

//DONE:This is called when page load
//DONE: call buildBoard() and renderBoard() here
function onInit() {   
    gBoard = buildBoard(level.SIZE)
    renderBoard(gBoard)
}

function restartGame(){
    minesLoc = []
    lives = 3
    isFirstClick = true
    gGame = {
        isOn: false,  
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0 
    }
    onInit()
}


function selectLevel(i){
    level = gLevel[i]
    flagsCount = level.MINES
    restartGame()
    clearInterval(setTime)
}



function createBtnLevel(){
    var btnVal = ''
    for (var i = 0; i < 3; i++) {
     btnVal += `<button onclick="selectLevel(${i})">${gLevel[i].LEVEL}</button>`     
}  
var elBtnContainer = document.querySelector('.btn-container')
elBtnContainer.innerHTML = btnVal
}

function createTimer(){
    var timerVal = ''
    timerVal = `<div id="timer" class="timer">Time: 000</div>`     

var elTimerContainer = document.querySelector('.timer-container')
elTimerContainer.innerHTML = timerVal
}


function createLives(){ 
    var livesVal = '' 
    for (var i = 0; i < lives; i++) {
        livesVal += `<div class="live">${LIVE_IMG}</div>`     
}  
var ellivesContainer = document.querySelector('.lives-container')
ellivesContainer.innerHTML = livesVal
}

//DONE: Builds the board 
//DONE: Set the mines 
//DONE: Return the created board

function buildBoard(size) {
    createLives()
    createBtnLevel()
    creatSmily()
    createTimer()
    createFlagCounter()


    var board=[]
   //model A Matrix containing cell objects:Each cell
    for(var i =0 ; i <size ; i++){
        board.push([])
        for (var j = 0; j <size; j++){   
            board[i][j] = {           
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
              }  

        }
    }
    return board
}


//DONE Render the board as a <table> to the page 
function renderBoard(board){
    checkGameOver()
    
   
    console.log(gGame.shownCount , gGame.markedCount)
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'      
        for (var j = 0; j < board[0].length; j++) {
            const cellLoc = board[i][j]
            var numOfMinesAroundCell = cellLoc.minesAroundCount
            const className = `cell cell-${i}-${j}`
            var isShownCell =''
            var cellView = ''
          
            if(cellLoc.isShown && !cellLoc.isMarked ){
                if(cellLoc.isMine){
                cellView = MINE_IMG
                }else{
                cellView = numOfMinesAroundCell === 0 ? '' : numOfMinesAroundCell
                isShownCell = cellLoc.isShown? "is-shown-cell" : ''              
                }
            } 
            if(cellLoc.isMarked){
                cellView = FLAG_IMG
             
            }  

              
            strHTML += 
            `<td class="${className} ${isShownCell}" onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onCellMarked(event, this, ${i} ,${j})"> 
            ${cellView}
            </td>`  
            
            
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
 
} 




function countMinesAroundCell(board, rowIdx, colIdx) { 
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i >= 0 && i < board.length && j >= 0 && j < board[0].length) {
                if (i === rowIdx && j === colIdx) continue
                if (board[i][j].isMine) {
                    count++
                }  
            }
        }
    }
    return count
}

//DONE Count mines around each cell and set the cell's minesAroundCount. 
//DONE I need to iterate over the board and count the number of mines around each cell, updating the minesAroundCount property accordingly

function setMinesNegsCount(board) {
for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (!board[i][j].isMine) {
                board[i][j].minesAroundCount = countMinesAroundCell(board, i, j)         
            }
        }
    }
   // renderBoard(board)
}



//DONE Called when a cell is clicked 
//TODO The smiley face needs to change :0
//this is the left click :When left clicking on cells there are 3 possible cases we want to address:
// DONE MINE – reveal the mine clicked
// • Cell with neighbors – reveal the cell alone
// • Cell without neighbors – expand it and its 1st degree
// neighbors

var startTime
function onCellClicked(elCell, i, j){ 
    const cellLoc = gBoard[i][j]

    if (isFirstClick) {
       startTime = Date.now()
        setTime =  setInterval(elTimer, 1000)

        addMines(level.MINES, i, j)
        setMinesNegsCount(gBoard)
        gGame.isOn = true
        isFirstClick = false
    }

    if(cellLoc.isMarked || cellLoc.isShown || !gGame.isOn) return
    if(!cellLoc.isMine){
        if( cellLoc.minesAroundCount === 0){                      
            expandShown(gBoard, elCell,i, j)   
         }
          else{
            cellLoc.isShown = true   
            gGame.shownCount++

            console.log(cellLoc)     
            renderBoard(gBoard)     
         }
         
         }else{
            if(lives > 0){
                lives--
                playSound('lostLive')

                createLives()

            }else{
                for(var x = 0; x < minesLoc.length; x++ ){
                    minesLoc[x].isShown = true      
                } 
                checkGameOver(true)
            }
    
 
        renderBoard(gBoard)    
    }
          
}

//TODO needed to add img
//DONE for loop with getRandomCellLoc - at the util
//TODO needed to be changed after the  development phase to the for loop 


function addMines(numOfMines, firstClickedRow, firstClickedcol){     
        for(var y = 0; y < numOfMines; y++){
            const mine = getRandomCellLoc(firstClickedRow , firstClickedcol)
            gBoard[mine.i][mine.j].isMine = true
            minesLoc.push(gBoard[mine.i][mine.j])
        }
}



  
//DONE Called when a cell is **rightclicked** , See how you can hide the context 
//DONE Implement the logic to mark the cell with a flag and update the game state
//DONELeft click reveals the cell’s content
//DONE Right click flags/unflags a suspected cell (cannot reveal a flagged cell)
// this is te rigth click 

function onCellMarked(event ,elCell, i, j){
   event.preventDefault()
var cellLoc = gBoard[i][j]
   if(cellLoc.isShown && !cellLoc.isMarked || !gGame.isOn) return
   cellLoc.isMarked = !cellLoc.isMarked 
   cellLoc.isMarked? gGame.markedCount++ : gGame.markedCount--  
   cellLoc.isMarked? flagsCount-- : flagsCount++
       createFlagCounter()
   console.log( 'gGame.markedCount' ,  gGame.markedCount, 'flagsCount: ', flagsCount)
   renderBoard(gBoard)  
}


function createFlagCounter(){ 
    var FlagCounterVal = '' 
    FlagCounterVal = `<div class="counter">mines to mark: ${flagsCount}</div>`     
 
var elFlagCounterContainer = document.querySelector('.flagCounter-Container')
    elFlagCounterContainer.innerHTML = FlagCounterVal
}


function creatSmily(gameStatus){ 
    var smilyVal = '' 
    var smileyFace

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

    smilyVal = `<div class="smily">${smileyFace}</div>`     

var elSmilyContainer = document.querySelector('.smily-container')
elSmilyContainer.innerHTML = smilyVal
}




//TODO Game ends when all mines are marked, and all the other cells are shown 
//TODO The smiley face needs to change  :)
//Done LOSE: when clicking a mine, all the mines are revealed
//TODO WIN all the mines are flagged, and all the other cells areshown

function checkGameOver(checkIfLost){
    if(checkIfLost === true){
        gGame.isOn = false
        creatSmily('lose')
        playSound('lostGame')
        clearInterval(setTime)
       }
   if(gGame.shownCount + gGame.markedCount === Math.pow(level.SIZE, 2) && gGame.markedCount === minesLoc.length){
    gGame.isOn = false
    creatSmily('win')
    playSound('winGame')
    clearInterval(setTime)
   }
  
   
}

//TODO  When user clicks a cell with no mines around, we need to opennot only that cell, 
//but also its neighbors.
// TODO NOTE: start with a basic implementation that only opensthe non-mine 1st degreeneighbors

// TODO BONUS: if you have the timelater, try to work more like the
// real algorithm (see description at the Bonuses section below)
//
function expandShown(board, elCell,rowIdx, colIdx){
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i >= 0 && i < board.length && j >= 0 && j < board[0].length) {
                const cellLoc = board[i][j] 
                if (cellLoc.isMine || cellLoc.isMarked || cellLoc.isShown) continue                           
                    cellLoc.isShown = true 
                    gGame.shownCount++                                                    
            }
        }
    
    }    
   renderBoard(gBoard)  
}

function elTimer() {
    const elapsedTime = (Date.now() - startTime) /1000
    const formattedTime = elapsedTime.toFixed(0).padStart(3, '0')
    document.getElementById('timer').textContent = `Time: ${formattedTime}`
}

 
