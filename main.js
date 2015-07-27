var context;
var soundBuffer = null;
var source ;

window.addEventListener('load', init, false);

function init() {
    try {
        context = new (window.AudioContext || window.webkitAudioContext);
    }
    catch (e) {
        alert('Web Audio API is not supported in this browser');
    }
    aReq.send();
}

var aReq = new XMLHttpRequest();
aReq.responseType = 'arraybuffer'
aReq.onload = reqListener;
aReq.open("get", "samples/Onze-20 - Joao e Grazi.mp3", true);


function reqListener() {
    context.decodeAudioData(aReq.response, function (buffer) {
        soundBuffer = buffer;
        playSound(soundBuffer)
    });
}

function playSound(buffer) {
    source = context.createBufferSource();
    source.buffer = soundBuffer;
    source.connect(context.destination);
    source.start(0);
}