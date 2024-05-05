'use strict'
const MINE ='MINE'
const FLAG = 'FLAG'


const MINE_IMG = '💣'
const FLAG_IMG = '🚩'
const LIVE_IMG = '❤️'

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
    // addMines(level.MINES)
    // setMinesNegsCount(gBoard)
    renderBoard(gBoard)
}

function restartGame(){
    minesLoc = []
    lives = 3
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
    restartGame()
}

function createBtnLevel(){
    var btnVal = '' 
    for (var i = 0; i < 3; i++) {
     btnVal += `<button onclick="selectLevel(${i})">${gLevel[i].LEVEL}</button>`     
}  
var elBtnContainer= document.querySelector('.btn-container')
elBtnContainer.innerHTML = btnVal
}


function createLives(){ 
    var divVal = '' 
    for (var i = 0; i < lives; i++) {
        divVal += `<div>${LIVE_IMG}</div>`     
}  
var elDetailsContainer = document.querySelector('.lives-container')
elDetailsContainer.innerHTML = divVal
}
//DONE: Builds the board 
//TODO: Set the mines 
//DONE: Return the created board
function buildBoard(size) {
    createLives()
    createBtnLevel()
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
//TODO displaying each cell with its appropriate state (shown, hidden, flag)

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
            var zeroCell =''
            var cellView = ''
          
            if(cellLoc.isShown && !cellLoc.isMarked ){
                if(cellLoc.isMine){
                cellView = MINE_IMG
                }else{
                cellView = numOfMinesAroundCell === 0 ? '' : numOfMinesAroundCell
                zeroCell = cellLoc.minesAroundCount === 0? "zero-cell" : ''              
                }
            } 
            if(cellLoc.isMarked){
                cellView = FLAG_IMG
            }  
          
            strHTML += 
            `<td class="${className} ${zeroCell}" onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onCellMarked(event, this, ${i} ,${j})"> 
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
function onCellClicked(elCell, i, j){ 
    const cellLoc = gBoard[i][j]

    if (!gGame.isOn) {
        addMines(level.MINES, i, j)
        setMinesNegsCount(gBoard)
        gGame.isOn = true
    }

    if(cellLoc.isMarked) return
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
                createLives()
                console.log(lives)
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
   if(gBoard[i][j].isShown && !gBoard[i][j].isMarked) return
   gBoard[i][j].isMarked = !gBoard[i][j].isMarked 
   gBoard[i][j].isMarked? gGame.markedCount++ : gGame.markedCount-- 
   renderBoard(gBoard)  
}

//TODO Game ends when all mines are marked, and all the other cells are shown 
//TODO The smiley face needs to change  :)
//Done LOSE: when clicking a mine, all the mines are revealed
//TODO WIN all the mines are flagged, and all the other cells areshown

function checkGameOver(checkIfLost){
    if(checkIfLost === true){
        console.log('you lost')
       }
   if(gGame.shownCount + gGame.markedCount === Math.pow(level.SIZE, 2) && gGame.markedCount === minesLoc.length){
    console.log('you won')
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
    const elapsedTime = (Date.now() - startTime) / 10
    const formattedTime = elapsedTime.toFixed(3)
    document.getElementById('timer').textContent = `Time: ${formattedTime}`
}

 



