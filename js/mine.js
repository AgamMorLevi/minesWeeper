'use strict'
const MINE ='MINE'

const MINE_IMG = '💣'
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
        alert= 'All mines are placed, start playing'  
        for(var y = 0; y < minesLoc.length; y++){
          
            minesLoc[y].isShown = false
            console.log(minesLoc, i ,j)

        }
      manuallyMode=false      
}       

countMinesAroundCell(gBoard, i, j)

}


function createMinesManuallyBtn(){
    var minesManuallyVal = ''
    minesManuallyVal +=` <button onclick=" manuallyMode = true">Add Mines</button>`
    document.querySelector('.manuallyModebtn').innerHTML = minesManuallyVal
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



