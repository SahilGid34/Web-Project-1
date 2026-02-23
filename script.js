let sqr;
function init(){
    sqr = document.getElementById("square");
    gameLoop();
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
        const norm = Math.sqrt((MoveSpeed **2) * 2)/4;
        changeX *= norm;
        changeY *= norm;
    }



    if ((Number(sqr.style.top.slice(0,-2)) + changeY) < 0){
        sqr.style.top = "0px";
    } else if ((Number(sqr.style.top.slice(0,-2)) + changeY) > (Number(window.innerHeight) - Number(window.getComputedStyle(sqr).getPropertyValue('height').slice(0,-2))-5)) {
        sqr.style.top = (Number(window.innerHeight) - Number(window.getComputedStyle(sqr).getPropertyValue('height').slice(0,-2))-5) + "px";
    } else{
        sqr.style.top = (Number(sqr.style.top.slice(0,-2)) + changeY) + "px";
    }

    if ((Number(sqr.style.left.slice(0,-2)) + changeX) < 0){
        sqr.style.left = "0px";
    } else if ((Number(sqr.style.left.slice(0,-2)) + changeX) > (Number(window.innerWidth) - Number(window.getComputedStyle(sqr).getPropertyValue('width').slice(0,-2))-4)) {
        sqr.style.left = (Number(window.innerWidth) - Number(window.getComputedStyle(sqr).getPropertyValue('width').slice(0,-2))-5) + "px";
    } else {
        sqr.style.left = (Number(sqr.style.left.slice(0,-2)) + changeX) + "px";
    }

    
    /*if (document.documentElement.clientHeight != window.innerHeight){
        console.log(sqr.style.top)
        sqr.style.top = (Number(sqr.style.top.slice(0,-2)) - 10);
        setTimeout(() => {
            sqr.style.top = (Number(sqr.style.top.slice(0,-2)) + 10);
        }, 5)
        
    }*/
}

function play(){
    setInterval(move_sqr, 10);
}

function gameLoop(){
    play();
}