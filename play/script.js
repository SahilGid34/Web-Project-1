// sqr creation
const sqr = document.getElementById("square");
function init(){
    //TODO: move this somewhere else
    //fix score allignment
    document.getElementById("score-container").style["margin-top"] = window.getComputedStyle(document.getElementById("progress-container")).getPropertyValue('height');

    prepGame();

    
}

window.onload = init

// used to know attributes of circles
const ghost_cir = document.createElement("img");
ghost_cir.src = "../assets/circle.png";
ghost_cir.setAttribute('class', "circle");
ghost_cir.style.display = "none";

const shop_container = document.getElementById("shop-container");

// score creation
const scoreObj = {
    round_score: 0,
    set score(val) {
        this.round_score = val;
        document.getElementById("score-text").textContent = this.round_score;
    },
    get score() {
        return this.round_score;
    },

    full_score: 0,
    set curency(val) {
        this.full_score = val;
        document.getElementById("shop-info-curency-text").textContent = this.full_score;
    },
    get curency() {
        return this.full_score;
    },

    transferScore(){
        this.curency += this.score;
        this.score = 0;
    },

};

// progress bar creation
const timerObj = {
    // all time in ms
    targetTime: 30_000,
    currentTime: 0,
    
    get percent() {
        return this.currentTime / this.targetTime;
    },

    update(time_ms) {
        this.currentTime += time_ms;
    },

    reset() {
        this.currentTime = 0;
    },

    isDone(){
        return this.currentTime >= this.targetTime;
    }
};

const progressTimerObj = {
    __proto__: timerObj,
    progressBar: document.getElementById("progress-time"),
    
    update(time_ms) {
        super.update(time_ms)
        this.progressBar.style["width"] = (this.percent * 100) + "%";
    }
    // Overide Update
};

// modifier and deck creation

// Hard code this when testing locally
const cardData = (() => (fetch('./cards.json').then(response => {return response.json()})))();


function Card(cardJson){
    this.__proto__ = cardJson;
    eval(cardJson["method_adder"]);
}

const modifiers = {
    square: {
        moveSpeed: 3,
    },
    circle: {
        minSpawned: 1,
        spawnChanceMult: 1,
        onSpawnCircle: [],
        onConsumeCircle: [],
    },
    deck: {
        arr: [],
        push: function(card){
            card.onAdd();
            this.arr.push(card);
        },
        pull: function(ind){
            card = this.arr[ind];
            this.arr.splice(ind, 1);
            card.onRemove();
        }
    },
    hooks: {
        onSpawnCircle: () => modifiers.circle.onSpawnCircle.forEach((e) => e()),
        onConsumeCircle: () => modifiers.circle.onConsumeCircle.forEach((e) => e()),
    }
}

// custom key detection to get a constant signal while pressed
let keysSet = new Set();
function onKeyDown(keyEvent){
    keysSet.add(keyEvent.code);
}
function onKeyUp(keyEvent){
    keysSet.delete(keyEvent.code);
}

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

// IntervalID for Update
let updateID;

//TODO: Fix rounding issue leading to square minorly leaving the screen
function move_sqr(){
    const MoveSpeed = Math.round(modifiers.square.moveSpeed)

    if (keysSet.size == 0){
        return;
    }

    let changeX = 0;
    let changeY = 0;

    if (keysSet.has("KeyW")){
        changeY += -MoveSpeed;
    } if (keysSet.has("KeyA")){
        changeX += -MoveSpeed;
    } if (keysSet.has("KeyS")){
        changeY += +MoveSpeed;
    } if (keysSet.has("KeyD")){
        changeX += +MoveSpeed;
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
        scoreObj.score += 1;

        modifiers.hooks.onConsumeCircle()
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

    modifiers.hooks.onSpawnCircle();
}

function try_spawn_circle(){
    if (document.querySelectorAll(".circle").length < modifiers.circle.minSpawned){
        spawn_circle();
    } else if (Math.random() <= 0.003 * modifiers.circle.spawnChanceMult){
        spawn_circle();
    }
}

function update(){
    move_sqr();
    eat_circle();
    try_spawn_circle();
    progressTimerObj.update(10);
    if (progressTimerObj.isDone()){
        openShop();
    }
}

function play(){
    document.removeEventListener('keydown', play);

    updateID = setInterval(update, 10);
}

function prepGame(){
    progressTimerObj.reset();
    progressTimerObj.update(0);
    document.addEventListener('keydown', play);
}

// Shop functions
function stockShop(){
    const suits = ["Circle", "Square", "Points", "Timer"];
    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

    Array.from(document.querySelectorAll(".shop-item")).forEach(function(element, index, arr) {
        Array.from(element.children).forEach((e) => e.remove());
        
        const card = cardData[suits[Math.floor(Math.random()*4)]][values[Math.floor(Math.random()*13)]]
        
        let title = document.createElement("p");
        title.setAttribute('class', "shop-item-title");
        title.textContent = card.display.title + " (" + card.price + ")";

        let imgDiv = document.createElement("div");
        imgDiv.setAttribute('class', "shop-item-img");
        imgDiv.style["background-image"] = "url(../assets/Deck/" + card.display.image_path + ")";

        let text = document.createElement("p");
        text.setAttribute("class", "shop-item-text")
        text.textContent = card.display.description;

        imgDiv.appendChild(text)
        
        function buy(){
            if (card.price <= scoreObj.curency){
                scoreObj.curency -= card.price;

                const c = new Card(card);
                modifiers.deck.push(c);

                title.textContent = "Sold Out (0)";
                imgDiv.style["background-image"] = "url(../assets/Deck/Empty.png)";
                text.textContent = "";

                imgDiv.removeEventListener('click', buy);
            } else {
                console.log("no")
                // add some sort of animation to tell the player
            }
        }

        imgDiv.addEventListener('click', buy)

        element.appendChild(title);
        element.appendChild(imgDiv);
    });
}

function openShop(){
    clearInterval(updateID);
    stockShop();
    //move the transfer when an animation is made
    scoreObj.transferScore();
    shop_container.style["display"] = "block";
}

function closeShop(){
    shop_container.style["display"] = "none";
    prepGame();
}