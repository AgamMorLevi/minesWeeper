'use strict'


var hints = 3
var hintCells = []
var hintMode = false

function onInitHelpers(){
    creatsafeClick()

}

function hintExpendShow(rowIdx,colIdx ){
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i >= 0 && i < gBoard.length && j >= 0 && j < gBoard[0].length) {
                const cellLoc = gBoard[i][j]              
                if (cellLoc.isMarked || cellLoc.isShown) continue   
                hintCells.push(cellLoc)                         
                    cellLoc.isShown = true 
                    gGame.shownCount++                                                                         
            }
        }
    
    }    
   renderBoard(gBoard)  
}

function hintClicked(i ,j) {   
   
   if(hints > 0){
    var hintLoc = {i,j} 
            if (!hintLoc.isShown && !hintLoc.isMarked)
             {
                hintLoc.isShown = true
                gGame.shownCount++  
                hintCells.push(hintLoc) 
                hintExpendShow(hintLoc.i, hintLoc.j)
                hintMode = false
            }
           
   }
   
 setTimeout(() => {
    for (var x = 0; x < hintCells.length; x++) {
        var cell = hintCells[x]
        cell.isShown = false
        gGame.shownCount--   
    }

        hintCells  = []     
        renderBoard(gBoard)  
    }, 1000)
  
    hints--
    createHints()   
}


function createHints(){
    var hintsVal = ''
    for (var i = 0; i < hints; i++) {
        hintsVal += `<div class="hint" onclick="activeHintMode(this)">${HINT_IMG}</div>`    
}  
var elHintsContainer = document.querySelector('.hints-container')
elHintsContainer.innerHTML = hintsVal
}

function activeHintMode(elHint){
    hintMode = true
    elHint.classList.add('hint-active')
}


var safeClickcount = 3
var safeClickCells=[]

function creatsafeClick(){

    var safeClickVal = ''
    for (var i = 0; i < safeClickcount; i++) {
        safeClickVal += `<button onclick="safeClick()">Safe Click</button> `
    }  

var elbtnSafeClickContainer = document.querySelector('.btnSafeClick-container')
elbtnSafeClickContainer.innerHTML = safeClickVal

}


var safeMode = false

function safeClick(safeClickLoc){
    safeMode = true

    if(safeClickcount > 0){

        var safeClickLoc = getRandomCellLoc()
        var safeCell = gBoard[safeClickLoc.i][safeClickLoc.j]
        if(!safeCell.isMarked && !safeCell.isShown && !safeCell.isMine){
           
            var elSafeCell = document.querySelector(`.cell-${safeClickLoc.i}-${safeClickLoc.j}`)
            elSafeCell.classList.add('safe-clicked')

            setTimeout(() => {
                elSafeCell.classList.remove('safe-clicked')
                safeMode = false
            }, 1000)

        }
   
       }
       
       safeClickcount--
       creatsafeClick()
}

