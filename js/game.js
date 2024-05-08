'use strict'

const FLAG_IMG = '🚩'
var gBoard 

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
var isFirstClick = true
var flagsCount = level.MINES

var gGame = {
    isOn: false, 
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0 
}


function onInit() {
    gBoard = buildBoard(level.SIZE)
    createFlagCounter()
    onInitHelpers()
    onInitDetails()
    renderBoard(gBoard) 
    createMinesManuallyBtn()
    
}

function restartGame(){
    minesLoc = []
    lives = 3
    safeClickcount = 3
    isFirstClick = true
    hints = 3
    gGame = {
        isOn: false, 
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0 
    }

    createHints()
    startTime = Date.now()
    onInit()
}

function buildBoard(size) {
   
    var board=[]
   
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


function renderBoard(board){
    checkGameOver()

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



function onCellClicked(elCell, i, j){ 
    const cellLoc = gBoard[i][j]

    if (isFirstClick && manuallyMode === false ) {
       startTime = Date.now()
        
        gGame.secsPassed = setInterval(createTimer, 1000)
         if(minesLoc.length === 0){
            addMines(level.MINES, i, j)  
         }

        setMinesNegsCount(gBoard)   
        createHints()
        document.querySelector('.manuallyModebtn').remove()

        gGame.isOn = true
        isFirstClick = false
    }

    
    if(manuallyMode === true){
        addMinesManually(level.MINES,i,j)  
    }

    if(hintMode){
        hintClicked(i ,j)
    }

    if(cellLoc.isMarked || cellLoc.isShown || !gGame.isOn) return
    if(!cellLoc.isMine){
        if( cellLoc.minesAroundCount === 0){                      
            expandShown(gBoard,i, j)   
         }
          else{
            cellLoc.isShown = true   
            gGame.shownCount++   
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

function onCellMarked(event ,elCell, i, j){
   event.preventDefault()
var cellLoc = gBoard[i][j]
   if(cellLoc.isShown && !cellLoc.isMarked || !gGame.isOn) return
   cellLoc.isMarked = !cellLoc.isMarked 
   cellLoc.isMarked? gGame.markedCount++ : gGame.markedCount--  
   cellLoc.isMarked? flagsCount-- : flagsCount++
       createFlagCounter()
   renderBoard(gBoard)  
}


function checkGameOver(checkIfLost){
    if(checkIfLost === true){
        gGame.isOn = false
        creatSmily('lose')
        playSound('lostGame')
        clearInterval(gGame.secsPassed)
       }
   if(gGame.shownCount + gGame.markedCount === Math.pow(level.SIZE, 2) && gGame.markedCount === minesLoc.length){
    gGame.isOn = false
    creatSmily('win')
    playSound('winGame')
    clearInterval(gGame.secsPassed)
   }
  
   
}

function expandShown(board,rowIdx, colIdx){
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i >= 0 && i < board.length && j >= 0 && j < board[0].length) {
                const cellLoc = board[i][j] 
                if (cellLoc.isMine || cellLoc.isMarked || cellLoc.isShown) continue                           
                    cellLoc.isShown = true 
                    gGame.shownCount++   
               
                    if (cellLoc.minesAroundCount === 0) {
                        expandShown(board, i, j)  
                    }                                             
            }
        }
    
    }    
   renderBoard(gBoard)  
}


