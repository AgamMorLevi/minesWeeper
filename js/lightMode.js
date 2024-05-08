'use strict'

function toggleLightMode() {
    var element = document.body;
    element.classList.toggle('lightMode')
}

function createLightModeButton() {
    var lightModeButton = document.querySelector('.lightMode')
    lightModeButton.addEventListener('click', toggleLightMode)
}