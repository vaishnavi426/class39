class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

    this.leaderboardTitle = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    car1 = createSprite(width/2-100,height-100);
    car1.scale = 0.075;
    car1.addImage("car1",car1_img);

    car2 = createSprite(width/2+100,height-100);
    car2.scale = 0.075;
    car2.addImage("car2",car2_img);

    cars = [car1, car2];
  }

  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    this.resetTitle.html("RESET GAME");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width/2+200,40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width/2+230,100);

    this.leaderboardTitle.html("LEADERBOARD");
    this.leaderboardTitle.class("resetText");
    this.leaderboardTitle.position(width/3-60,40);

    this.leader1.html("RESET GAME");
    this.leader1.class("leadersText");
    this.leader1.position(width/3-50,80);

    this.leader2.html("RESET GAME");
    this.leader2.class("leadersText");
    this.leader2.position(width/3-50,130);
  }

  play() {
    this.handleElements();
    this.handleResetButton();
    Player.getPlayersInfo();
    if(allPlayers!==undefined){
      image(track,0,-height*5,width,height*6);
      this.showLeaderboard();

      var index = 0;
      for(var plr in allPlayers){
        index += 1;
        var x = allPlayers[plr].positionX;
        var y = height-allPlayers[plr].positionY;

        cars[index-1].position.x = x;
        cars[index-1].position.y = y;

        if(index==player.index){
          noStroke();
          fill("lightBlue");
          ellipse(x,y,60,60);

          camera.position.x = cars[index-1].position.x;
          camera.position.y = cars[index-1].position.y;
        }
      }
      this.handlePlayerControl();
      drawSprites();
    }
  }
  update(state) {
    database.ref("/").update({
      gameState: state
    })
  }
  handlePlayerControl() {
    if(keyIsDown(UP_ARROW)){
      player.positionY += 10;
      player.update();
    }
    if(keyIsDown(LEFT_ARROW)&& player.positionX>width/3-50){
      player.positionX -= 5;
      player.update();
    }
    if(keyIsDown(RIGHT_ARROW)&& player.positionX>width/2+300){
      player.positionX += 5;
      player.update();
    }
  }
  showLeaderboard() {
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if((players[0].rank==0 && players[1].rank==0)|| players[0].rank==1){
      leader1 = players[0].rank+"&emsp"+players[0].name+"&emsp"+players[0].score;
      leader2 = players[1].rank+"&emsp"+players[1].name+"&emsp"+players[1].score;
    }
    if(players[1].rank==1){
      leader2 = players[0].rank+"&emsp"+players[0].name+"&emsp"+players[0].score;
      leader1 = players[1].rank+"&emsp"+players[1].name+"&emsp"+players[1].score;
    }
    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }
  handleResetButton() {
    this.resetButton.mousePressed(()=>{
    database.ref('/').set({
      carsAtEnd: 0,
      gameState: 0,
      playerCount: 0,
      players: {}
    });
    window.location.reload();
    });
  }
}
