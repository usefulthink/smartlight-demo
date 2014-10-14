function renderMovingCircle(ctx,t,state) {
  // update state
  state.x = ((t/200) % 16) - 4;

  // render it..
  ctx.clearRect(0,0,8,8);
  ctx.fillStyle = 'blue';
  ctx.strokeStyle = 'red';
  ctx.strokeWidth = 2;

  ctx.beginPath();
  ctx.arc(state.x, 4, 3, 0, Math.PI*2, true);
  ctx.closePath();

  ctx.stroke();
  ctx.fill();
}

function renderPulsingCircle(ctx, t, state) {
  var r = (1+Math.sin(t/200)) * 2.5,
      c1 = (1+Math.sin(t/200)) / 2;

  ctx.clearRect(0,0,8,8);

  var red = Math.floor(256*(c1)),
      green = Math.floor(256*(1-c1));

  ctx.strokeStyle = 'rgb('+red+','+green+', 0)';
  console.log(ctx.strokeStyle);
  ctx.strokeWidth = 1;

  ctx.beginPath();
  ctx.arc(4, 4, r, 0, Math.PI*2, true);
  ctx.closePath();

  ctx.stroke();
}
