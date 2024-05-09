'use strict'
const MINE ='MINE'

const MINE_IMG = '💣'
const MINEEXT_IMG = '💥'
var minesLoc = []
var manuallyMode = false


function addMines(numOfMines, firstClickedRow, firstClickedcol){     

for(var y = 0; y < numOfMines; y++){
            const mine = getRandomCellLoc(firstClickedRow , firstClickedcol)
            gBoard[mine.i][mine.j].isMine = true           
            minesLoc.push(gBoard[mine.i][mine.j])

        }
    
}

function addMinesManually(numOfMines,i,j){
        
    var cellLoc = gBoard[i][j]
    cellLoc.isMine = true
    cellLoc.isShown = true
    minesLoc.push(cellLoc)
    renderBoard(gBoard)

if(numOfMines === minesLoc.length){   

    for(var y = 0; y < minesLoc.length; y++){
      
        minesLoc[y].isShown = false

    }

  manuallyMode=false      
}       

countMinesAroundCell(gBoard, i, j)

}


function createMinesManuallyBtn(){

    var minesManuallyVal = ''
    minesManuallyVal =`<button class="manuallyModebtn" onclick="manuallyMode = true">Add Mines</button>`
    document.querySelector('.manuallyModebtn-container').innerHTML = minesManuallyVal

}

function createMineExterminatorBtn(){
    var mineExterminatorVal = ''
    mineExterminatorVal =`<button class="exterminatorBtn" onclick="mineExterminator()">MINE EXTERMINATOR </button>`
    document.querySelector('.exterminator').innerHTML = mineExterminatorVal

    
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



function setMinesNegsCount(board) {
for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (!board[i][j].isMine) {
                board[i][j].minesAroundCount = countMinesAroundCell(board, i, j)         
            }
        }
    }
   
}


function mineExterminator(){
    var mineIdx = []
    var previousIdx = -1

while(mineIdx.length !== 3){
    var randomIdx = getRandomInt(0, minesLoc.length)
    
    if (randomIdx === previousIdx) continue         
    var elCell = document.querySelector(`.cell-${minesLoc[randomIdx].i}-${minesLoc[randomIdx].j}`)
    minesLoc[randomIdx].isMine = false 
    previousIdx = randomIdx
    elCell.innerHTML = MINEEXT_IMG
    mineIdx.push(randomIdx)
}
    
    
    minesLoc = minesLoc.filter((cell) => cell.isMine === true)
    flagsCount -= mineIdx.length
    document.querySelector('.exterminatorBtn').remove()
    createFlagCounter()
    setMinesNegsCount(gBoard)
    
}



