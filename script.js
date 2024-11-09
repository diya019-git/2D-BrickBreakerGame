//variables
let board;
let boardwidth=500;
let boardheight=500;
let context;

let playerwidth=80;
let playerheight=10;
let playervelocityX=20;

//player object
let player={
    x:boardwidth/2-playerwidth/2,
    y:boardheight-playerheight-5,
    width:playerwidth,
    height:playerheight,
    velocityX:playervelocityX
}

//ball
let ballheight=10;
let ballwidth=10;
let ballvelX=3;
let ballvelY=2;
let rad=8

let ball={
    x:boardwidth/2,
    y:boardheight/2, 
    radius:rad,
    width:ballwidth,
    height:ballheight,
    velocityX:ballvelX,
    velocityY:ballvelY
}

let blockArray=[];
let blockwidth=50;
let blockheight=10;
let blockrows=5;
let blockcol=8
let blockmaxrow=10
let blockcount=0;

let blockX=15;
let blockY=45

let score=0
let gameOver=false

//main background board
window.onload = function(){
    board=document.getElementById("board");
    board.height=boardheight;
    board.width=boardwidth;
    context=board.getContext("2d");
    
    context.fillStyle="skyblue";
    context.fillRect(player.x,player.y,player.width,player.height);

    requestAnimationFrame(update);
    document.addEventListener("keydown",moveplayer)

    createBlocks()
}

//checks whether the player is out of the margin or not
function outofbound(xposition){
    return (xposition<0 ||xposition+playerwidth> boardwidth)
}

function update(){
    requestAnimationFrame(update);
    if(gameOver) return;
    context.clearRect(0,0,board.width,board.height);

    context.fillStyle="skyblue";
    context.fillRect(player.x,player.y,player.width,player.height);

    //move ball
    context.fillStyle = "white";

    // Update ball position
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Draw the ball as a circle
    context.beginPath(); // Start a new path
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2); // Draw a circle (x, y, radius)
    context.fill(); // Fill the circle with the current fill color


    //if ball touches the top
    if(ball.y<=0){
        ball.velocityY*=-1;
    }
    else if(ball.x<=0 || (ball.x+ball.width>=boardwidth)){
        ball.velocityX*=-1;
    }
    else if(ball.y+ball.height>=boardheight){
        //game over
        context.font="23px impact"
        context.fillText("Game Over: Press 'Space' to restart",80,400)
        gameOver=false
    }

    if(topCollision(ball,player)||bottomCollision(ball,player)){
        ball.velocityY*=-1;
    }
    else if(leftCollision(ball,player)||rightCollision(ball,player)){
        ball.velocityX*=-1;
    }

    for(let i=0;i<blockArray.length;i++){
        let block=blockArray[i]
        
        if(!block.break){
            if(topCollision(ball,block) || bottomCollision(ball,block)){
                ball.velocityY*=-1
                block.break=true
                blockcount--;
                score+=100
            }
            else if(leftCollision(ball,block) || rightCollision(ball,block)){
                ball.velocityX*=-1;
                block.break=true
                blockcount--;
                score+=100
            }
            context.fillStyle=block.color
            context.fillRect(block.x,block.y,block.width,block.height)
        }
    }

    context.font="20px impact"
    context.fillStyle="white"
    context.fillText(score,boardheight/2-16,25);

    if(blockcount==0){
        score+=100*blockrows*blockcol
        blockrows=Math.min(blockrows+1,blockmaxrow)
        createBlocks()
    }
}

//move the player
function moveplayer(e){
    if(e.code=="Space"){
        resetGame()
    }
    if(e.code=="ArrowLeft"){
        let nextplayerx=player.x-player.velocityX;
        if(!outofbound(nextplayerx)){
            player.x=nextplayerx;
        }
    }
    else if(e.code=="ArrowRight"){
        let nextplayerx=player.x+player.velocityX;
        if(!outofbound(nextplayerx)){
            player.x=nextplayerx;
        }
    }
}

function detectCollision(a,b){
    return a.x<b.x+b.width && a.x+a.width>b.x && a.y<b.y+b.height && a.y+a.height>b.y;
}

function topCollision(ball,block){
    return detectCollision(ball,block) && ball.y+ball.y>=block.y;
}
function bottomCollision(ball,block){
    return detectCollision(ball,block) && block.y+block.height>=ball.y;
}
function leftCollision(ball,block){
    return detectCollision(ball,block) && ball.x+ball.width>=block.x;
}
function rightCollision(ball,block){
    return detectCollision(ball,block) && block.x+block.width>=ball.x;
}

function createBlocks(){
    blockArray=[]  //clearing blockarray
    const rndmcolor=getRandomColor()
    for(let c=0;c<blockcol;c++){
        for(let r=0;r<blockrows;r++){
            let block={
                x:blockX + c*blockwidth +c*10,
                y:blockY + r*blockheight +r*10,
                color:rndmcolor,
                height:blockheight,
                width:blockwidth,
                break:false
            }
            blockArray.push(block)
        }
    }
    blockcount=blockArray.length;
}

function resetGame(){
    gameOver=false
    player={
        x:boardwidth/2-playerwidth/2,
        y:boardheight-playerheight-5,
        width:playerwidth,
        height:playerheight,
        velocityX:playervelocityX
    }

    ball={
        x:boardwidth/2,
        y:boardheight/2,
        radius:rad, 
        width:ballwidth,
        height:ballheight,
        velocityX:ballvelX,
        velocityY:ballvelY
    }

    blockArray=[]
    score=0
    createBlocks()
}

function getRandomColor() {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33F6', '#F6FF33', '#FF8C00', '#8A2BE2', '#00FF7F'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}