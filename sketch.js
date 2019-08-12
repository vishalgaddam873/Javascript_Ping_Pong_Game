var canvas;
var computerPaddle, playerPaddle;
var computerScore = 0;
var playerScore = 0;
var ball;
var gamestate = "serve"
var scoreSound, wall_hitSound, hitSound;

function preload(){
  scoreSound = loadSound('sounds/score.mp3');
  wall_hitSound = loadSound('sounds/wall_hit.mp3');
  hitSound = loadSound('sounds/hit.mp3');
}


function setup(){
  canvas = createCanvas(900,800);

  computerPaddle = createSprite(15,280,15,180);
  computerPaddle.shapeColor = "red"

  playerPaddle = createSprite(885,280,15,180);
  playerPaddle.shapeColor = "black";

  ball = createSprite(width/2, height/2, 20,20);
}

function draw(){
  background("lightblue");
  edges = createEdgeSprites();

  //Score Board
  textSize(40)
  text(computerScore,width/2 - 70,50);
  text(playerScore, width/2 + 50,50);

  //Game in serve State
  if (gamestate === "serve") {
    textSize(30)
    text("Press Space to Serve",320,height/2 - 100);
    ball.position.x = width/2;
    ball.position.y = height/2;
    computerPaddle.position.y = ball.position.y
  }

  if (keyDown("space") && gamestate == "serve") {
    ball.velocityX = 5;
    ball.velocityY = 5;
    gamestate = "play"
  }

  // Game in Play State
  if(gamestate==="play"){
    //Make Paddles movable
    playerPaddle.position.y = mouseY;
    computerPaddle.position.y = ball.y;

    //Give score to players
    if (ball.x < 0) {
      scoreSound.play();
      playerScore++;
    }
    else if (ball.x > width) {
      scoreSound.play();
      computerScore++;
      gamestate = "serve"
    }

    //make the ball bounce off the top and bottom walls
    if (ball.isTouching(edges[2]) || ball.isTouching(edges[3])) {
      wall_hitSound.play();
      ball.bounceOff(edges[2]);
      ball.bounceOff(edges[3]);
    }

    //make the ball bounce off the playerPaddle and computerPaddle
    if (ball.isTouching(playerPaddle) || ball.isTouching(computerPaddle)) {
      hitSound.play();
      ball.bounceOff(playerPaddle);
      ball.bounceOff(computerPaddle);
    }

    //Game will over
    if (computerScore === 5 || playerScore === 5){
      gamestate = "over"
    }
  }

  // Game in over state
  if(gamestate === "over"){
    textSize(30);
    text("Game Over!",380,300);
    text("Press 'R' to Restart",350,420);
  }

  if(gamestate === "over" && keyDown('r')){
    gamestate = "serve"
    playerScore = 0;
    computerScore = 0;
  }

  drawNet();
  drawSprites();
}


function drawNet(){
  for(var num = 5; num < height; num = num+20){
    stroke(255);
    strokeWeight(4)
    line(width/2,num,width/2,num+10);
    noStroke();
  }
}
