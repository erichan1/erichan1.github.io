/*This is boxgame. There will be a red box on a white background. Walls will move from the right side towards the left. The box can be moved in any direction. If it collides with a box */

var myBox; //equivalent to myGamePiece in the tutorial.
var myObstacles;
var myWalls;
var myScore;



//MAIN: starts the game. Calls start() function in myGameArea. Creates a box, walls, and obstacles.
function startGame() {
    myGameArea.start();
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
        this.interval=setInterval(updateGameArea, 10);

        window.addEventListener('keydown',function(e) {
            myGameArea.keys= (myGameArea.keys || [] );
            myGameArea.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup',function(e) {
            myGameArea.keys[e.keyCode]=false;
        })

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
        this.speedX = 0;
        this.speedY = 0;
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

//STATIC METHOD: handles collision with components. Takes two components. Only alters one component.
function componentColHandle(myComponent,myComponent2){
     if(componentColDetect(myComponent,myComponent2)) {
       var distAbs1 = Math.abs(myComponent.x+myComponent.width-myComponent2.x); //distance between right side myComponent and left myComponent2
       var distAbs2 = Math.abs(myComponent2.x+myComponent2.width-myComponent.x); //distance between right side myComponent2 and left myComponent
       var distAbs3 = Math.abs(myComponent.y+myComponent.height-myComponent2.y); //distance between top side myComponent2 and bottom myComponent
       var distAbs4 = Math.abs(myComponent2.y+myComponent2.height-myComponent.y); //distance between top side myComponent and bottom myComponent2
       var dist1 = myComponent.x+myComponent.width-myComponent2.x; //X position diff used to push component out of other component
       var dist2 = -(myComponent2.x+myComponent2.width-myComponent.x); //X position diff used to push component out of other component
       var dist3 = myComponent.y+myComponent.height-myComponent2.y; //Y position diff used to push component out of other component
       var dist4 = -(myComponent2.y+myComponent2.height-myComponent.y); //Y position diff used to push component out of other component
       var distAbsX; //relevant distX;
       var distAbsY; //relevant distY;
       var distX;
       var distY;

       //finds the distance between the relevant sides on X axis that will contact.
       if (distAbs1<distAbs2) {
         distAbsX=distAbs1;
         distX=dist1;
       }
       else {
         distAbsX=distAbs2;
         distX=dist2;
       }
       //finds the distance between the relevant sides on Y axis that will contact.
       if(distAbs3<distAbs4) {
         distAbsY=distAbs3;
         distY=dist3;
       }
       else {
         distAbsY=distAbs4;
         distY=dist4;
       }
       //depending on the position of the box, only one axis pushes back.
       if(distAbsX>distAbsY) {
         //myComponent.y-=myComponent.speedY;//moves box back according to its speed on y axis
         myComponent.y-=distY;//moves box back according to its speed on y axis
       }
       else if(distAbsY>distAbsX){
         //myComponent.x-=myComponent.speedX; //moves box back according to its speed on x axis
         myComponent.x-=distX;
       }
       else {
         myComponent.y-=distY;
         myComponent.x-=distX;
         //myComponent.y-=myComponent.speedY;//moves box back according to its speed on y axis
         //myComponent.x-=myComponent.speedX; //moves box back according to its speed on x axis
       }
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
    if(myGameArea.keys && myGameArea.keys[39]) {
            //myBox.incrementSpeedX(4);
            myComponent.setSpeedX(1); //makes box go right
    }
    if(myGameArea.keys && myGameArea.keys[37]) {
            //myBox.incrementSpeedX(-4);
            myComponent.setSpeedX(-1); //makes box go left
    }
    if(myGameArea.keys && myGameArea.keys[38]) {
            //myBox.incrementSpeedY(-4);
            myComponent.setSpeedY(-1); //makes box go up
    }
    if(myGameArea.keys && myGameArea.keys[40]) {
            //myBox.incrementSpeedY(4);
            myComponent.setSpeedY(1); //makes box go down.
    }
}

/*
STATIC METHOD:
interfaces the component with the keyboard. relies on window.addEventListener in myGameArea.
sets speed when WASD are pressed. Orientation one.
*/
function keyboardTwo(myComponent) {
    if(myGameArea.keys && myGameArea.keys[68]) {
            //myBox.incrementSpeedX(4);
            myComponent.setSpeedX(1); //makes box go right
    }
    if(myGameArea.keys && myGameArea.keys[65]) {
            //myBox.incrementSpeedX(-4);
            myComponent.setSpeedX(-1); //makes box go left
    }
    if(myGameArea.keys && myGameArea.keys[87]) {
            //myBox.incrementSpeedY(-4);
            myComponent.setSpeedY(-1); //makes box go up
    }
    if(myGameArea.keys && myGameArea.keys[83]) {
            //myBox.incrementSpeedY(4);
            myComponent.setSpeedY(1); //makes box go down.
    }
}

//STATIC METHOD: updates game area. interval shown in var myGameArea.
function updateGameArea() {
    myGameArea.clear(); //clears game area

    myBox.setSpeedZero(); //sets speeds to 0
    myBoxTwo.setSpeedX(0); //sets speeds to 0
    myBoxTwo.setSpeedY(0);
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
