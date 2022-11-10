function surviv_renderPlayer() {
  for (let i = 0; i < playermap.length; i++) {
    let player = playermap[i];
    // rendering a player. 플레이어를 렌더링합니다.

    surv_ctx.beginPath();

    if (player.blinksec % 2 == 0) {
      // 플레이어가 무적일 때 깜빡이게 표현
      surv_ctx.drawImage(
        player.player,
        player.x,
        player.y,
        50,
        70
      );
    }

    surv_ctx.fillStyle = player.color;
    surv_ctx.font = "bold 20px DungGeunMo";
    surv_ctx.fillText(
      player.nick,
      player.x - 14,
      player.y - 10
    );

    surv_ctx.closePath();

    // draw collision of player. 플레이어의 피격판정을 그립니다.
    if (SHOW_BOUNDING) {
      surv_ctx.beginPath();
      surv_ctx.strokeStyle = "lime";
      surv_ctx.lineWidth = 3;
      surv_ctx.strokeRect(
        player.x,
        player.y,
        50,
        70
      );
      //surv_ctx.arc(player.x, player.y, player.radius, Math.PI * 2, false);
      surv_ctx.stroke();
      surv_ctx.closePath();
    }
  } // end of for

  let curPlayer = players[myId];

  // 현재 플레이어만 그릴 수 있게 화살표는 이곳에서 그린다.
  surv_ctx.beginPath();

  surv_ctx.drawImage(
    curPlayer.arrow,
    curPlayer.x + 5,
    curPlayer.y - 42,
    32,
    32
  );

  surv_ctx.closePath();

  if (curPlayer.blinkNum > 0) {
    // reduce the blink time
    curPlayer.blinkTime--;

    if (curPlayer.blinkTime == 0) {
      curPlayer.blinkTime = Math.ceil(PER_SEC * FPS);
      curPlayer.blinkNum--;
    }
  } //end of if

  // 기절중이 아닐때에만 플레이어가 움직이도록 설정
  if (curPlayer.stunsec <= 0) {
    // 플레이어 이동
    if (rightPressed) {
      curPlayer.direction = 3;
      if (upPressed) {
        curPlayer.direction = 7;
        curPlayer.y -= curPlayer.PLAYERSPEED;
      } else if (downPressed) {
        curPlayer.direction = 6;
        curPlayer.y += curPlayer.PLAYERSPEED;
      }
      curPlayer.ismove = true;
      curPlayer.player.src = moveeffect(curPlayer);
      curPlayer.x += curPlayer.PLAYERSPEED;
      sendData(curPlayer);
    } //
    else if (upPressed) {
      curPlayer.direction = 2;
      if (rightPressed) {
        curPlayer.direction = 7;
        curPlayer.x += curPlayer.PLAYERSPEED;
      } else if (leftPressed) {
        curPlayer.direction = 5;
        curPlayer.x -= curPlayer.PLAYERSPEED;
      }
      curPlayer.ismove = true;
      curPlayer.player.src = moveeffect(curPlayer);
      curPlayer.y -= curPlayer.PLAYERSPEED;
      sendData(curPlayer);
    } //
    else if (leftPressed) {
      curPlayer.direction = 1;
      if (upPressed) {
        curPlayer.direction = 5;
        curPlayer.y -= curPlayer.PLAYERSPEED;
      } else if (downPressed) {
        curPlayer.direction = 4;
        curPlayer.y += curPlayer.PLAYERSPEED;
      }
      curPlayer.ismove = true;
      curPlayer.player.src = moveeffect(curPlayer);
      curPlayer.x -= curPlayer.PLAYERSPEED;
      sendData(curPlayer);
    } //
    else if (downPressed) {
      curPlayer.direction = 0;
      if (rightPressed) {
        curPlayer.direction = 6;
        curPlayer.x += curPlayer.PLAYERSPEED;
      } else if (leftPressed) {
        curPlayer.direction = 4;
        curPlayer.x -= curPlayer.PLAYERSPEED;
      }
      curPlayer.ismove = true;
      curPlayer.player.src = moveeffect(curPlayer);
      curPlayer.y += curPlayer.PLAYERSPEED;
      sendData(curPlayer);
    } //
    else {
      curPlayer.player.src = curPlayer.asset[curPlayer.direction];
      curPlayer.ismove = false;
      sendData(curPlayer);
    } //
  } // end of playermove

  // handle use item. 아이템 사용을 구현합니다.
  if (itemPressed) {
    if (curPlayer.hasItem) {
      Itemeffect(curPlayer.itemPocket);
    }
    curPlayer.hasItem = false;
  }

  // handle edge of screen // 플레이어가 화면 밖으로 벗어나지 몬하도록
  if (curPlayer.x < (X * 4) / 100 + curPlayer.radius) {
    curPlayer.x = (X * 4) / 100 + curPlayer.radius;
  } else if (curPlayer.x > (X * 96) / 100 - curPlayer.radius * 2) {
    curPlayer.x = (X * 96) / 100 - curPlayer.radius * 2;
  }

  if (curPlayer.y < (Y * 13) / 100 + curPlayer.radius) {
    curPlayer.y = (Y * 13) / 100 + curPlayer.radius;
  } else if (curPlayer.y > Y - curPlayer.radius * 2) {
    curPlayer.y = Y - curPlayer.radius * 2;
  }

  // 플레이어의 점수가 0 미만으로 떨어지면
  if (curPlayer.score < 0) {
    curPlayer.score = 0;
  }
}

function surviv_player(id, nick, x, y, color) {
  this.id = id;
  this.nick = nick;
  this.direction;
  this.asset = [
    // 플레이어로써 출력 될 이미지.
    // 이미지는 총 8개 (회사원 이미지로 대체 예정)
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451716855582750/dd_17.png", // 아래
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451526304137217/gg_12.png", // 왼쪽
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451443055607838/gg_05.png", // 위
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451573129367592/gg_13.png", // 오른
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451629450481664/gg_16.png", // 왼아래
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451379939717130/dd_03.png", // 왼위
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451865224884234/gg_18.png", // 오른아래
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451494075125800/gg_07.png",
  ];
  this.PLAYERSPEED = 5;
  this.radius = 25; // 반지름
  this.color = color; // 닉네임 색
  this.x = x; // x 좌표
  this.y = y; // y 좌표
  this.player = new Image();
  this.player.src = this.asset[0]; // 플레이어의 현재 이미지. 방향키를 누를때 바뀐다.
  this.arrow = new Image(); // 플레이어 위치를 가리킬 화살표.
  this.arrow.src = "https://cdn.discordapp.com/attachments/980090904394219562/1039148418993492018/Untitled_11-07-2022_08-55-41.png"; // 화살표 이미지 링크.
  this.score = 0; // 플레이어의 현재 점수
  this.blinksec = 0;

  this.stunsec = -1;
  this.speedUpsec = -1;
  this.itemImg = new Image();
  this.hasItem = false;
  this.itemPocket = -1;

  // 이동관련
  this.ismove = false;
  this.cnt = 0;
  this.direction = 0;
}
