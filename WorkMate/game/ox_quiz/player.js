function ox_renderPlayer() {
  // rendering a player. 플레이어를 렌더링합니다.
  // 모든 플레이어를 그리는 코드
  for (let i = 0; i < playermap.length; i++) {
    let ball = playermap[i];
    ox_ctx.drawImage(ball.player, ball.x, ball.y);
    ox_ctx.beginPath();
    ox_ctx.fillStyle = ball.color;
    ox_ctx.font = "15px Arial";
    ox_ctx.fillText(ball.nick, ball.x + 15, ball.y - ball.radius + 10);
    ox_ctx.closePath();
  }
  let curPlayer = players[myId];
  // 플레이어 이동
  if (!is_end && !is_checking) {
    if (rightPressed) {
      curPlayer.direction = 3;
      if (upPressed) {
        curPlayer.direction = 7;
        curPlayer.y -= curPlayer.playerSpeed;
      } else if (downPressed) {
        curPlayer.direction = 6;
        curPlayer.y += curPlayer.playerSpeed;
      }
      curPlayer.ismove = true;
      curPlayer.player.src = moveeffect(curPlayer);
      curPlayer.x += curPlayer.playerSpeed;
      sendData(curPlayer);
    } else if (upPressed) {
      curPlayer.direction = 2;
      if (rightPressed) {
        curPlayer.direction = 7;
        curPlayer.x += curPlayer.playerSpeed;
      } else if (leftPressed) {
        curPlayer.direction = 5;
        curPlayer.x -= curPlayer.playerSpeed;
      }
      curPlayer.ismove = true;
      curPlayer.player.src = moveeffect(curPlayer);
      curPlayer.y -= curPlayer.playerSpeed;
      sendData(curPlayer);
    } else if (leftPressed) {
      curPlayer.direction = 1;
      if (upPressed) {
        curPlayer.direction = 5;
        curPlayer.y -= curPlayer.playerSpeed;
      } else if (downPressed) {
        curPlayer.direction = 4;
        curPlayer.y += curPlayer.playerSpeed;
      }
      curPlayer.ismove = true;
      curPlayer.player.src = moveeffect(curPlayer);
      curPlayer.x -= curPlayer.playerSpeed;
      sendData(curPlayer);
    } else if (downPressed) {
      curPlayer.direction = 0;
      if (rightPressed) {
        curPlayer.direction = 6;
        curPlayer.x += curPlayer.playerSpeed;
      } else if (leftPressed) {
        curPlayer.direction = 4;
        curPlayer.x -= curPlayer.playerSpeed;
      }
      curPlayer.ismove = true;
      curPlayer.player.src = moveeffect(curPlayer);
      curPlayer.y += curPlayer.playerSpeed;
      sendData(curPlayer);
    } else {
      curPlayer.player.src = curPlayer.asset[curPlayer.direction];
      curPlayer.ismove = false;
    }
  }

  if (players[myId].y > Y - curPlayer.radius * 2) {
    players[myId].y = Y - curPlayer.radius * 2;
  }

  if (players[myId].x < 0) {
    players[myId].x = 0;
  } else if (players[myId].x > X - curPlayer.radius * 2) {
    players[myId].x = X - curPlayer.radius * 2;
  }

  if (players[myId].x < 0) {
    players[myId].x = 0;
  } else if (players[myId].x > X - radius * 2) {
    players[myId].x = X - radius * 2;
  }

  if (players[myId].x < X / 2) {
    players[myId].is_O = true;
  } else if (players[myId].x >= X / 2) {
    players[myId].is_O = false;
  }
}

function ox_player(id, nick) {
  this.id = id;
  this.nick = nick;
  this.asset = [
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451716855582750/dd_17.png", // 아래
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451526304137217/gg_12.png", // 왼쪽
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451443055607838/gg_05.png", // 위
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451573129367592/gg_13.png", // 오른
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451629450481664/gg_16.png", // 왼아래
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451379939717130/dd_03.png", // 왼위
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451865224884234/gg_18.png", // 오른아래
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451494075125800/gg_07.png", // 오른위
  ];

  this.color = "#FF00FF";
  this.x = X / 2;
  this.y = Y / 2;
  this.player = new Image();
  this.player.src = this.asset[0];
  this.score = 0;
  this.radius = 16;
  this.PLAYERSPEED = 5;

  // 판정 관련
  this.is_O;

  // 이동 관련
  this.ismove = false;
  this.cnt = 0;
  this.direction = 0;
}
