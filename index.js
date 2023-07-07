let dir = {x:0, y:0};
let foodSound = new Audio('food.wav');
let moveSound = new Audio('move.mp3');
let gameOver = new Audio('gameover.wav');
let speed = 5;
let lastPaintTime = 0;
let snakeArray = [{x:12, y:15}];
let food = {x: Math.round(2+Math.random()*16), y: Math.round(2+Math.random()*16)};
let paused=0;
let score=0;
let x=0;
let level;
var easyHiscoreval, medHiscoreval, hardHiscoreval;


function main(ctime) {
    window.requestAnimationFrame(main);
    // console.log(ctime);
    if(gamePaused(snakeArray)){
        document.getElementById("pause").style.display="block";
        return;
    }
    if(ctime-lastPaintTime < 1000/speed) {
        return;
    }
    lastPaintTime=ctime;
    gameEngine();
}


function getSpeed() {
    level = document.getElementById('select1').value;
    if(level==="easy")
        speed = 5;
    else if(level==="medium")
        speed = 10;
    else if(level==="hard")
        speed = 20;
}



function gamePaused(snakeArray){
    if(collision(snakeArray))
        return false;
    if(dir.x===0 && dir.y===0 && paused===1)
        return true;
    return false;
}

function collision(snakeArray){
    for(let i=1;i<snakeArray.length;i++){
        if(snakeArray[i].x===snakeArray[0].x && snakeArray[i].y===snakeArray[0].y)
            return true;
    }
    if(level==="hard" || level==="medium"){
        if(snakeArray[0].x<=0 || snakeArray[0].x>=20 || snakeArray[0].y>=20 || snakeArray[0].y<=0)
            return true;
    }
    
    return false;
}

function updateHighscore(score){
    if(level==="easy"){
        if(score>easyHiscoreval){
            easyHiscoreval = score;
            localStorage.setItem("easyHiscore", JSON.stringify(easyHiscoreval));
            document.getElementById("easyHsbox").innerHTML = "Easy: " + easyHiscoreval;
        }
    }
    else if(level==="medium"){
        if(score>medHiscoreval){
            medHiscoreval = score;
            localStorage.setItem("medHiscore", JSON.stringify(medHiscoreval));
            document.getElementById("medHsbox").innerHTML = "Medium: " + medHiscoreval;
        }
    }
    else if(level==="hard"){
        if(score>hardHiscoreval){
            hardHiscoreval = score;
            localStorage.setItem("hardHiscore", JSON.stringify(hardHiscoreval));
            document.getElementById("hardHsbox").innerHTML = "Hard: " + hardHiscoreval;
        }
    }

}


function gameEngine(){
    
    // Check if collision has occured or not
    if(collision(snakeArray))
    {
        gameOver.play();
        dir = {x:0, y:0};
        document.getElementById("gameOver").style.display="block";
        updateHighscore(score);
        snakeArray={x:13, y:15};
        x=0;
        score=0;
        document.getElementById("play").style.display="block";
    }

    // Check if food is eaten and generate new food if eaten
    if(snakeArray[0].x === food.x && snakeArray[0].y === food.y)
    {
        foodSound.play();
        score+=1;
        document.getElementById("scoreBox").innerHTML = "Score: "+score;
        snakeArray.unshift({x: snakeArray[0].x+dir.x, y: snakeArray[0].y+dir.y});
        if(level==="hard" || level==="medium"){
            food = {x: Math.round(1+Math.random()*19), y: Math.round(1+Math.random()*19)};
        }
        else{
            food = {x: Math.round(2+Math.random()*16), y: Math.round(2+Math.random()*16)};
        }
    }

    // Move the snake
    for(let idx=snakeArray.length-1; idx>0;idx--)
        snakeArray[idx] = {...snakeArray[idx-1]};
    snakeArray[0].x+=dir.x;
    snakeArray[0].y+=dir.y;
    if(snakeArray[0].x<0)
        snakeArray[0].x=20;
    if(snakeArray[0].x>20)
        snakeArray[0].x=0;
    if(snakeArray[0].y<0)
        snakeArray[0].y=20;
    if(snakeArray[0].y>20)
        snakeArray[0].y=0;

    // Print snake
    board.innerHTML="";
    snakeArray.forEach((e,idx)=>{
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if(idx===0){
            snakeElement.classList.add('head');
        }
        else{
            snakeElement.classList.add('body');
        }   
        board.appendChild(snakeElement);
    });

    // Print food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
    
}

document.getElementById("play").style.display="none";
document.getElementById("gameOver").style.display="none";
document.getElementById("pause").style.display="none";

// Fetch high score from local storage
let easyHiscore = localStorage.getItem("easyHiscore");
if(easyHiscore === null){
    easyHiscoreval = 0;
    localStorage.setItem("easyHiscore", JSON.stringify(easyHiscoreval))
}
else{
    easyHiscoreval = JSON.parse(easyHiscore);
}
document.getElementById("easyHsbox").innerHTML = "Easy : " + easyHiscoreval;

let medHiscore = localStorage.getItem("medHiscore");
if(medHiscore === null){
    medHiscoreval = 0;
    localStorage.setItem("medHiscore", JSON.stringify(medHiscoreval))
}
else{
    medHiscoreval = JSON.parse(medHiscore);
}
document.getElementById("medHsbox").innerHTML = "Medium : " + medHiscoreval;

let hardHiscore = localStorage.getItem("hardHiscore");
if(hardHiscore === null){
    hardHiscoreval = 0;
    localStorage.setItem("hardHiscore", JSON.stringify(hardHiscoreval))
}
else{
    hardHiscoreval = JSON.parse(hardHiscore);
}
document.getElementById("hardHsbox").innerHTML = "Hard : " + hardHiscoreval;

window.requestAnimationFrame(main);
window.addEventListener('keydown', e=>{
    dir={x:0, y:0};
    switch (e.key) {
        case "ArrowUp":
            // console.log("ArrowUp");
            x=1;
            document.getElementById("pause").style.display="none";
            dir.x=0;
            dir.y=-1;
            moveSound.play();
            break;
        case "ArrowDown":
            x=1;
            // console.log("ArrowDown");
            document.getElementById("pause").style.display="none";
            dir.x=0;
            dir.y=1;
            moveSound.play();
            break;
        case "ArrowRight":
            x=1;    
            // console.log("ArrowRight");
            document.getElementById("pause").style.display="none";
            dir.x=1;
            dir.y=0;
            moveSound.play();
            break;
        case "ArrowLeft":
            x=1;    
            // console.log("ArrowLeft");
            document.getElementById("pause").style.display="none";
            dir.x=-1;
            dir.y=0;
            moveSound.play();
            break;
        default:
            paused=x;
            dir.x=0;
            dir.y=0;
            break;
    }
});
