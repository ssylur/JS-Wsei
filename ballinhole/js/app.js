let ball = document.querySelector("#ball");
let container = document.getElementsByClassName("game-table")[0];
let holes = [];
let time = 0;
let gameRunState = false;
let speedX = 0, speedY = 0, posX = 5, posY = 5;
const startButton = document.getElementById('start');
startButton.addEventListener('click', init);
startButton.addEventListener('touch', init);
window.addEventListener('deviceorientation', gyroHandler);

function init() {
    gameRunState = true;
    spawnHoles();
    moveHandler();
    startButton.remove();
    setInterval(() => time++, 1000);
}


function gyroHandler(e) {
    speedX = e.gamma / 45;
    speedY = e.beta / 45;
}

function moveHandler() {
    if (posX + speedX < container.offsetWidth - 30 && posX + speedX > 0) {
        posX += speedX;
        ball.style.left = posX + 'px';
    }
    if (posY + speedY < container.offsetHeight - 30 && posY + speedY > 0) {
        posY += speedY;
        ball.style.top = posY + 'px';
    }

    for (i = 0; i < holes.length; i++) {
        if (posY < Math.floor(holes[i].style.top.slice(0, -2)) + 30 && posY > holes[i].style.top.slice(0, -2)) {
            if (posX > holes[i].style.left.slice(0, -2) && posX < Math.floor(holes[i].style.left.slice(0, -2)) + 30) {

                if (holes[i].classList.contains("target")) {
                    console.log('dsfsfsd');
                    alert('Nice! Your Time: ' + time + 's');
                }
                else if (holes[i].classList.contains("hole")) {
                    gameRunState = false;
                    alert('Lose. Your Time: ' + time + 's')
                }
            }
        }
    }

    if (gameRunState) {
        window.requestAnimationFrame(moveHandler)
    }
}

function spawnHoles() {
    for (i = 2; i < (container.offsetWidth / 100); i++) {
        let hole = document.createElement('div');
        hole.classList.add("hole");
        hole.style.left = 100 * i + Math.random() * 55 - 100 + 'px';
        hole.style.top = Math.random() * (container.offsetHeight - 75) / 2 + 'px';
        holes.push(hole);
        container.appendChild(hole);
    }
    for (i = 2; i < (container.offsetWidth / 100); i++) {
        let hole = document.createElement('div');
        hole.classList.add("hole");
        hole.style.left = 100 * i + Math.random() * 55 - 100 + 'px';
        hole.style.top = Math.random() * (container.offsetHeight) / 2 + container.offsetHeight / 2 - 75 + 'px';
        holes.push(hole);
        container.appendChild(hole);
    }
    checkHoles();
    createTarget(1);
}

function checkHoles() {
    for (i = 0; i < holes.length - 1; i++) {
        for (j = i + 1; j < holes.length; j++) {
            if (holes[j].style.left.slice(0, -2) > holes[i].style.left.slice(0, -2) + 30
                && holes[j].style.top.slice(0, -2) > holes[i].style.top.slice(0, -2) + 30) {
                holes[j].style.top = holes[j].style.top.slice(0, -2) + 50 + 'px';
                holes[j].style.left = holes[j].style.left.slice(0, -2) + 50 + 'px';
            }
        }
    }
}

function createTarget(i) {
    let goodHole = Math.floor(Math.random() * holes.length);
    (goodHole === i && i < holes.length) ? i++ : i--;
    holes[goodHole].classList.remove("hole");
    holes[goodHole].classList.add("target")

}
