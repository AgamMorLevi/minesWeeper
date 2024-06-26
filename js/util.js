'use strict'

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomCellLoc(firstClickedRow ,firstClickedcol) {
	var emptyLocs = []

	for (var i = 0; i < gBoard.length; i++) {
		const currRow = gBoard[i]
		for (var j = 0; j < currRow.length; j++) {
            if(firstClickedRow === i && firstClickedcol === j || gBoard[i][j].isMine)continue
			if((gBoard[i][j].isMine || gBoard[i][j].isShown) && safeMode === true)continue
			emptyLocs.push({ i, j })
		}
	}
 
	const randomIndex = Math.floor(Math.random() * emptyLocs.length)
	return emptyLocs[randomIndex]
}

function playSound(soundname) {
	var Sound = new Audio(`./sound/${soundname}.mp3`)
	Sound.play()

}





