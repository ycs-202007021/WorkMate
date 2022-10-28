function ItemAsteroid(x, y, xv, yv, id) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.xv = xv;
  this.yv = yv;
  this.radius = 90;    // 반지름
  this.image = new Image();
  // 커피
  this.image.src = "https://cdn.discordapp.com/attachments/980090904394219562/1025853759902990366/3ebfc342f3bcb6ca.png";
}

// 아이템은 움직이기 때문에 화면 밖으로 나가면 반대편에서 다시 나오게 설정

function renderSpecObs()
{
  if(roids_of_item_of_item.length >= 1)
  {
    //render
    for (let i = 0; i < roids_of_item_of_item.length; i++) {
      let R = roids_of_item_of_item[i];
      // rendering a Asteroid. 장애물을 화면에 출력합니다.
  
      ctx.beginPath();
      ctx.drawImage(
        R.image,
        R.x - R.radius,
        R.y - R.radius,
        180,
        180
      ); // 크기는 180, 180
  
      ctx.closePath();
    }

    // move
    for (let i = 0; i < roids_of_item_of_item.length; i++) {
      let R = roids_of_item_of_item[i];
      // Asteroid will move in field.
      R.x += R.xv;
      R.y += R.yv;
      // 영역밖으로 나갈 시 삭제
      if (R.x < -100 || R.x > 1900 || R.y < -100 || R.y > 1000) roids_of_item_of_item.splice(i,1);
    }
  }
}

function distSpecObs()
{
    if (myplayer.stunsec <= 0)
    {
      let px = myplayer.x;
      let py = myplayer.y;
      let sx;
      let sy;

      for (let i = 0; i < roids_of_item.length; i++) {
        sx = roids_of_item[i].x + roids_of_item[i].radius;
        sy = roids_of_item[i].y + roids_of_item[i].radius;

        if ((distBetweenPoints(px, py, ax, ay) < roids_of_item[i].radius + myplayer.radius) && (myplayer.id != roids_of_item[i].id)) {
          myplayer.stunsec = Math.ceil(PLAYER_STUN_DUR * FPS);
        }
      }
    }
}
