var socket = io.connect('http://localhost:9000');

navigator.getUserMedia = (
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia
);

function init(state) {
    // audio-context and nodes
    var actx = new AudioContext(),
        streamSrc = null,
        analyzer = actx.createAnalyser(),
        gain = actx.createGain();

    analyzer.fftSize = 32;
    analyzer.smoothingTimeConstant = .5;

    analyzer.connect(gain);
    gain.connect(actx.destination);


    // get an audio-stream from getUserMedia
    navigator.getUserMedia({ audio: true }, function(mediaStream) {
        streamSrc = actx.createMediaStreamSource(mediaStream);
        streamSrc.connect(analyzer);
    }, function(err) { console.error(err); });


    // initialize buffer and typed-array for frequency-data
    var buffer = new ArrayBuffer(analyzer.frequencyBinCount);

    state.analyzer = analyzer;
    state.freqData = new Uint8Array(buffer);
}


function renderFrame(ctx, t, state) {
    var d = state.freqData;
    state.analyzer.getByteFrequencyData(d);

    ctx.clearRect(0,0,8,8);
    ctx.save();
    ctx.fillStyle = 'red';

    for(var i=0; i<8; i++) {
        var v = (d[i])*8/256;

        ctx.fillRect(i,8-v,1,v);
    }
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

    init(state);

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