let sqr;
function init(){
    sqr = document.getElementById("square");
    prepGame();
}

window.onload = init

//used to know attributes of circles
const ghost_cir = document.createElement("img");
ghost_cir.src = "../assets/circle.png";
ghost_cir.setAttribute('class', "circle");
ghost_cir.style.display = "none";

let score = 0;
function add_score(addend){
    counter = document.getElementById("score");

    score += addend;
    counter.textContent = score;
}

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
    function remove_circle(c){
        c.remove();
        add_score(1);
    }
    
    const circles = Array.from(document.querySelectorAll(".circle"));
    circles.filter((c) => (
        Number(sqr.style.top.slice(0,-2)) <= Number(c.style.top.slice(0,-2)) &&
        (Number(sqr.style.top.slice(0,-2)) + Number(window.getComputedStyle(sqr).getPropertyValue('height').slice(0,-2))) >= (Number(c.style.top.slice(0,-2)) + Number(window.getComputedStyle(c).getPropertyValue('height').slice(0,-2))) &&
        Number(sqr.style.left.slice(0,-2)) <= Number(c.style.left.slice(0,-2)) &&
        (Number(sqr.style.left.slice(0,-2)) + Number(window.getComputedStyle(sqr).getPropertyValue('width').slice(0,-2))) >= (Number(c.style.left.slice(0,-2)) + Number(window.getComputedStyle(c).getPropertyValue('width').slice(0,-2)))
    )).forEach((c) => remove_circle(c));
    
}

function spawn_circle(){
    const body = document.getElementsByTagName("body")[0];

    const newCirc = document.createElement("img");
    newCirc.src = "../assets/circle.png";
    newCirc.setAttribute('class', "circle");
    
    body.appendChild(ghost_cir);

    const min_height = 0;
    const max_height = (Number(window.innerHeight) - window.getComputedStyle(ghost_cir).height.slice(0,-2));
    const min_width  = 0;
    const max_width  = (Number(window.innerWidth)  - window.getComputedStyle(ghost_cir).width.slice(0,-2));
    
    const top  = Math.floor((Math.random() * (max_height - min_height + 1))+ min_height) + "px";
    const left = Math.floor((Math.random() * (max_width  - min_width  + 1))+ min_width ) + "px";
    
    body.removeChild(ghost_cir);

    newCirc.setAttribute('style', "left: " + left + "; top: " + top + ";")

    body.appendChild(newCirc);
}

function try_spawn_circle(){
    if (Math.random() <= 0.005){
        spawn_circle();
    } else if (document.querySelectorAll(".circle").length == 0){
        spawn_circle();
    }
}

function update(){
    move_sqr();
    eat_circle();
    try_spawn_circle();
}

function play(){
    document.removeEventListener('keydown', play);

    setInterval(update, 10);
}

function prepGame(){
    document.addEventListener('keydown', play);
}