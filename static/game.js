 context = c.getContext("2d");
    context.font = "20px Arial";
    const bird = new Image();
    bird.src = "../static/bird.png";
      birdX = birdDY = score = bestScore = 0;
      interval = birdSize = pipeWidth = topPipeBottomY = 24;
      birdY = pipeGap = 200;
      canvasSize = pipeX = 400;
      gameOver = true;

    document.addEventListener("keydown",moveUp);  

    function moveUp() {
      if (gameOver== true)
       {
         gameOver = false;
       }
       else
       {
         birdDY = 9;
       }  // Jump
    }

    
setInterval(gameLoop, interval);

function setupNewGame() {
  birdDY = 0;
  birdY = 200;
  pipeX = canvasSize;
  score = 0;
}

    function gameLoop() {
    
      context.fillStyle = "skyblue";
      context.fillRect(0,0,canvasSize,canvasSize); // Draw sky

      context.drawImage(bird, birdX, birdY, birdSize * (524/374), birdSize); // Draw bird
      context.fillStyle = "green";

      context.fillRect(pipeX, 0, pipeWidth, topPipeBottomY); // Draw top pipe
      context.fillRect(pipeX, topPipeBottomY + pipeGap, pipeWidth, canvasSize); // Draw bottom pipe
      context.fillStyle = "black";

      bestScore = bestScore < score ? score : bestScore; // New best score?
      context.fillText(`Best: ${bestScore}`, 9, 50); // Draw best score

      if (gameOver) {
        context.fillText("Press any key to play!",100,200);
      }
      else{
        birdY -= birdDY; // update bird's y position
        birdDY -= 0.5; // fall with Gravity

        pipeX -= 8; // Move pipe

        pipeX < -pipeWidth && // Pipe off screen?
          ((pipeX = canvasSize), (topPipeBottomY = pipeGap * Math.random())); // Reset pipe and randomize gap.

        context.fillText(score++, 9, 25); // Increase and draw score
        
        // Bird hit pipe?  //&& // Bird falls off screen // Bird died
        if (((birdY < topPipeBottomY || birdY > topPipeBottomY + pipeGap) && 
              pipeX < birdSize * (524/374)) 
              || birdY > canvasSize) 
        {
            gameOver = true;

            // Send data to server
            $.ajax({
                url: "/api/"+ score + "/"
              }).done(function(res) {
                console.log(res.score);
              });

            setupNewGame();


        }
      }
    }

