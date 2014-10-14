var socket = io.connect('http://localhost:9000');

function renderFrame(ctx, t, state) {
    ctx.save();
    ctx.fillStyle = 'yellow';
    ctx.fillRect(0,0,8,8);

    var xShift = (t/200)%50;
    ctx.translate(-xShift,0);

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.font = '11px ProFontWindows';
    ctx.strokeText("JAVASCRIPT",8.5,8);
    ctx.restore();
}


function sendFrame(ctx) {
    var imgData = ctx.getImageData(0,0,8,8).data,
        pixeldata = [];

    for(var i=0; i<imgData.length; i+=4) {
        var alpha = imgData[i+3] / 256;

        pixeldata.push({
            r: Math.floor(alpha * imgData[i] * 16/256),
            g: Math.floor(alpha * imgData[i+1] * 16/256),
            b: Math.floor(alpha * imgData[i+2] * 16/256)
        });
    }

    socket.emit('pixeldata', pixeldata);
}

(function() {
    var c = document.querySelector('canvas'),
        ctx = c.getContext('2d');

    const FPS_LIMIT = 10;

    var tLast = 0,
        state = {};

    /**
     * @param t  high resolution timestamp
     */
    function animationLoop(t) {
        requestAnimationFrame(animationLoop);

        // limit to 20 FPS
        if(t-tLast < 1000/FPS_LIMIT) { return; }

        renderFrame(ctx, t, state);

        sendFrame(ctx);

        tLast = t;
    }

    requestAnimationFrame(animationLoop);
} ());