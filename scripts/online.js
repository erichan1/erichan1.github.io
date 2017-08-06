/*This is boxgame. There will be a red box on a white background. Walls will move from the right side towards the left. The box can be moved in any direction. If it collides with a box */

var updateInterval = 10; //How many milliseconds between each game update
var myBox; //equivalent to myGamePiece in the tutorial.
var myObstacles;
var myWalls; 
var myScore;



//MAIN: starts the game. Calls start() function in myGameArea. Creates a box, walls, and obstacles.
function startGame() {
    myGameArea.start();
    myKeyboard = new keyboard();
    myBox = new component(30,30,"red",10,120);
    myWalls = [new component(5,myGameArea.canvas.width,"orange",0,0), //top wall
               new component(myGameArea.canvas.height,5,"orange",0,0), //left wall
               new component(5,myGameArea.canvas.width,"orange",0,myGameArea.canvas.height-5), //bottom wall
               new component(myGameArea.canvas.height,5,"orange",myGameArea.canvas.width-5,0)]; //right wall
    myBoxTwo = new component(30,30,"blue",120,120);
}

//VAR: creates the gamearea, which is a canvas.
var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval=setInterval(updateGameArea, updateInterval);  
    },
    clear: function() {
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
    }
}

//CLASS: constructor of objects(components) in canvas.
function component(height,width,color,x,y) {
    this.width=width;
    this.height=height;
    this.x=x;
    this.y=y;
    this.speedX=0;
    this.speedY=0;
    this.accelUpdate; //the variable used to update acceleration methods
    this.update = function() {
        ctx = myGameArea.context;
        ctx.fillStyle=color;
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }  
    this.newPos = function() {
        this.x+=this.speedX;
        this.y+=this.speedY;
    }
    this.setSpeedY = function(speedY) {
        this.speedY = speedY;
    }
    this.setSpeedX = function(speedX) {
        this.speedX = speedX;
    }
    this.incrementSpeedX = function(increment) {
        this.speedX+=increment;
    }
    this.incrementSpeedY = function(increment) {
        this.speedY+=increment;
    }
    this.setSpeedZero = function() {
        clearInterval(this.accelUpdate);
        this.speedX = 0;
        this.speedY = 0;
    }
    //accelerates box up. sets the global variable accelUpdate to set an interval that calls moveUp every second. this increases speedY by -1. 
    this.setAccelX = function(xIncrement,time) {
        accelUpdate=setInterval(this.speedX+=xIncrement,time);
    }
    this.setAccelY = function(yIncrement,time) {
        accelUpdate=setInterval(this.speedY+=yIncrement,time);
    }
    //"destroys" the component. Still in memory, just is made into a point. 
    this.destroy=function() {
        this.width=0;
        this.height=0;
        this.x=0;
        this.y=0;
        this.speedX=0;
        this.speedY=0;
    }
    this.enlarge = function(multiplier) {
        this.x=this.x-this.width*.5*(multiplier-1);
        this.y=this.y-this.height*.5*(multiplier-1);
        this.height=this.height*multiplier;
        this.width=this.width*multiplier;
    }
    //METHOD: returns area of a component
    this.getArea = function() {
        return this.height*this.width;
    }
}

//STATIC METHOD: handles collision with walls. Takes two components. 
function wallColHandle(myComponent){
    if(wallColDetect(myComponent)=='vertical') { 
        myComponent.x-=myComponent.speedX; //stops box right and left
    }
    if(wallColDetect(myComponent)=='horizontal'){
        myComponent.y-=myComponent.speedY; //stops box top and bottom
    }
}

//STATIC METHOD: detects collision with walls. returns string that indicates if it's the top/bottom or left/right walls. 
function wallColDetect(myComponent){
    if(myComponent.x+myComponent.width>=myGameArea.canvas.width || myComponent.x<=0) { 
        return 'vertical'; //if collided with side walls, then this is returned.
    }
    if(myComponent.y<=0 || myComponent.y+myComponent.height>=myGameArea.canvas.height){
        return 'horizontal'; //if collided with top or bottom, then this is returned.
    }
}

//STATIC METHOD: handles collision with components. Takes two components. 
function componentColHandle(myComponent,myComponent2){
     if(componentColDetect(myComponent,myComponent2)) { 
            myComponent.x-=myComponent.speedX;
            myComponent.y-=myComponent.speedY;//stops box right and left
    }
}

//STATIC METHOD: returns boolean if collision between components occurs
function componentColDetect(myComponent,myComponent2){
     if(myComponent.x+myComponent.width>=myComponent2.x 
        && myComponent.y+myComponent.height>=myComponent2.y 
        && myComponent.x<=myComponent2.x+myComponent2.width
        && myComponent.y<=myComponent2.y+myComponent2.height) { 
        return true;
    }
    else {
        return false;
    }
}

//STATIC METHOD: checks how many obstacles are on screen. Goes through myObstacles array. 
function numObstaclesOnScreen() {
    var numOnScreen=0;
    for(i=0;i<myObstacles.length;i++) {
        if(componentColDetect(myObstacles[i],myWalls[0]) || componentColDetect(myObstacles[i],myWalls[2])) {
            numOnScreen++;
        }
    }
    return numOnScreen;
}

//STATIC METHOD: returns random # between min and max. not sure if inclusive. 
function getRandomBetween(min,max) {
    return Math.random() * (max-min)+min;
}

/*
STATIC METHOD: 
interfaces the component with the keyboard. relies on window.addEventListener in myGameArea. 
sets speed when arrowkeys are pressed. Orientation one. 
*/ 

function keyboardOne(myComponent) {
    if(inArray(myKeyboard.keysPressed,39)) {
        //myBox.incrementSpeedX(4);
        myComponent.setSpeedX(1); //makes box go right 
    }
    if(inArray(myKeyboard.keysPressed,37)) {
        myComponent.setSpeedX(-1); //makes box go left
    }
    
    if(inArray(myKeyboard.keysPressed,38)) {
        myComponent.setSpeedY(-1); //makes box go up
    }
    if(inArray(myKeyboard.keysPressed,40)) {
        myComponent.setSpeedY(1); //makes box go down.
    }
}


/*
STATIC METHOD: 
interfaces the component with the keyboard. relies on window.addEventListener in myGameArea. 
sets speed when WASD are pressed. Orientation one. 
*/ 

function keyboardTwo(myComponent) {
    if(inArray(myKeyboard.keysPressed,68)) {
        //myBox.incrementSpeedX(4);
        myComponent.setSpeedX(1); //makes box go right 
    }
    if(inArray(myKeyboard.keysPressed,65)) {
        myComponent.setSpeedX(-1); //makes box go left
    }
   
    
    if(inArray(myKeyboard.keysPressed,87)) {
        myComponent.setSpeedY(-1); //makes box go up
    }
    if(inArray(myKeyboard.keysPressed,83)) {
        myComponent.setSpeedY(1); //makes box go down.
    }
    
}



//keyboard interface. maybe make into class. holds what keys were pressed and released between last iteration. essentially a virtual model of what's going on in real keyboard.  
function keyboard() {
    
    this.keys = (this.keys || [] ); //put outside function. don't need to press a key to make keys array.  
    window.addEventListener('keydown',function(e) {
        this.keys[e.keyCode] = true; 
    })
    window.addEventListener('keyup',function(e) {
        this.keys[e.keyCode]=false;
    })
    
    this.updateInterval = updateInterval;
    
    //contains keyIDs for all letters, arrow keys, space, some others.
    
    this.keyIDs = [8,9,13,16,17,18,19,20,27,33,34,35,36,37,38,39,40,45,46,48,49,50,51,52,53,54,55,56,
                  57,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90];
    
    this.keysNow = [];
    
    this.keysBefore = [];
    this.keysPressed = [];
    
    this.keysReleased = [];
    this.interval = setInterval(this.keyboardUpdate,this.updateInterval); //not sure if this will work.
    
    this.keyboardUpdate = function() {
        //initializes keysNow and puts all keys pressed rn into the array. 
        this.keysNow = [];
        this.keysPressed = [];
        this.keysReleased = [];
        for(i=0;i<this.keyIDs.length;i++) {
            if(this.keys[this.keyIDs[i]]==true){
                this.keysNow.push(this.keyIDs[i]);
            }      
        }
        
        //compare now and before. 
        for(i=0;i<this.keysNow.length;i++) {
            if(!inArray(this.keysBefore,this.keysNow[i])){
                this.keysPressed.push(this.keysNow[i]) //if something is in keysNow but not keysBefore goes in keysPressed.
            }
        }
        //compare now and before. 
        for(j=0;j<this.keysBefore.length;j++) {
            if(!inArray(this.keysNow,this.keysBefore[j])){
                this.keysReleased.push(this.keysBefore[j]) //if something is in keysNow but not keysBefore goes in keysPressed.
            }
        }
        //copies elements from keysNow to keysBefore; 
        for(i=0;i<this.keysNow.length;i++) {
            this.keysBefore.push(this.keyNow[i]);  
        }
        console.log("keyBoardUpdate is working");
    }
    
}

//STATIC METHOD: returns true if an object is in an array and false if not.
function inArray(array,object) {
    this.inArr=false; 
    for(i=0;i<array.length;i++) {
        if(object==array[i]) {
            this.inArr = true;
        }
    }
    return this.inArr;
}

//STATIC METHOD: updates game area. interval shown in var myGameArea.
function updateGameArea(int) {
    myGameArea.clear(); //clears game area

    keyboardOne(myBox); //sets speed according to keyboard
    keyboardTwo(myBoxTwo);
    
    for(i=0;i<myWalls.length;i++) {
        myWalls[i].update();
    }
    myBoxTwo.newPos();
    myBoxTwo.update();
    myBox.newPos(); //shifts x and y based on speed.
    myBox.update(); //draws myBox in the changed x and y position
    
    for(i=0;i<myWalls.length;i++) {
        componentColHandle(myBox,myWalls[i]);
        componentColHandle(myBoxTwo,myWalls[i]);
    }
    if(componentColDetect(myBox,myBoxTwo)) {
       myBox.destroy();
       myBoxTwo.enlarge(3);
    }
}

//STATIC METHOD: alters the HTML element jsprintout with inputed string
function print(string) {
    document.getElementById("jsprintout").innerHTML = string;
}





