let score = 0;
let sqr;
function init(){
    sqr = document.getElementById("square");
    prepGame();
}

window.onload = init

let keysSet = new Set();
function onKeyDown(keyEvent){
    keysSet.add(keyEvent.code);
}
function onKeyUp(keyEvent){
    keysSet.delete(keyEvent.code);
}

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);



//TODO: Fix rounding issue leading to square minorly leaving the screen
function move_sqr(){
    const MoveSpeed = 2

    if (keysSet.size == 0){
        return;
    }

    let changeX = 0;
    let changeY = 0;

    if (keysSet.has("KeyW")){
        changeY = -MoveSpeed;
    } if (keysSet.has("KeyA")){
        changeX = -MoveSpeed;
    } if (keysSet.has("KeyS")){
        changeY = +MoveSpeed;
    } if (keysSet.has("KeyD")){
        changeX = +MoveSpeed;
    }
    
    if (changeX !== 0 && changeY !== 0){
        const norm = Math.sqrt((MoveSpeed **2) * 2)/(MoveSpeed*2);
        changeX *= norm;
        changeY *= norm;
    }



    if ((Number(sqr.style.top.slice(0,-2)) + changeY) < 0){
        sqr.style.top = "0px";
    } else if ((Number(sqr.style.top.slice(0,-2)) + changeY) > (Number(window.innerHeight) - Number(window.getComputedStyle(sqr).getPropertyValue('height').slice(0,-2)))) {
        sqr.style.top = (Number(window.innerHeight) - Number(window.getComputedStyle(sqr).getPropertyValue('height').slice(0,-2))) + "px";
    } else{
        sqr.style.top = (Number(sqr.style.top.slice(0,-2)) + changeY) + "px";
    }

    if ((Number(sqr.style.left.slice(0,-2)) + changeX) < 0){
        sqr.style.left = "0px";
    } else if ((Number(sqr.style.left.slice(0,-2)) + changeX) > (Number(window.innerWidth) - Number(window.getComputedStyle(sqr).getPropertyValue('width').slice(0,-2)))) {
        sqr.style.left = (Number(window.innerWidth) - Number(window.getComputedStyle(sqr).getPropertyValue('width').slice(0,-2))) + "px";
    } else {
        sqr.style.left = (Number(sqr.style.left.slice(0,-2)) + changeX) + "px";
    }

}

function eat_circle(){
    const circles = Array.from(document.querySelectorAll(".circle"));
    circles.filter((c) => (
        Number(sqr.style.top.slice(0,-2)) <= Number(c.style.top.slice(0,-2)) &&
        (Number(sqr.style.top.slice(0,-2)) + Number(window.getComputedStyle(sqr).getPropertyValue('height').slice(0,-2))) >= (Number(c.style.top.slice(0,-2)) + Number(window.getComputedStyle(c).getPropertyValue('height').slice(0,-2))) &&
        Number(sqr.style.left.slice(0,-2)) <= Number(c.style.left.slice(0,-2)) &&
        (Number(sqr.style.left.slice(0,-2)) + Number(window.getComputedStyle(sqr).getPropertyValue('width').slice(0,-2))) >= (Number(c.style.left.slice(0,-2)) + Number(window.getComputedStyle(c).getPropertyValue('width').slice(0,-2)))
    )).forEach((c) => c.remove());
}

function update(){
    move_sqr();
    eat_circle();
}

function play(){
    document.removeEventListener('keydown', play);

    setInterval(update, 10);
}

function prepGame(){
    document.addEventListener('keydown', play);
}