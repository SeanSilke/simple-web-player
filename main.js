// define variables
var context = new (window.AudioContext || window.webkitAudioContext);;
var source;
var gainNode;
var soundBuffer = null;

var volumeControl = document.querySelector('.volume-control');
///

var aReq = new XMLHttpRequest();
aReq.responseType = 'arraybuffer'
aReq.onload = reqListener;
aReq.open("get", "samples/Onze-20 - Joao e Grazi.mp3", true);
aReq.send();

function reqListener() {
    context.decodeAudioData(aReq.response, function (buffer) {
        soundBuffer = buffer;
        playSound(soundBuffer)
    });
}

function playSound(buffer) {
    source = context.createBufferSource();
    source.buffer = soundBuffer;
    gainNode = context.createGain();
    source.connect(gainNode);
    gainNode.connect(context.destination);
    gainNode.gain.value = volumeControl.value;
    source.start(0);
}

// wire up buttons
volumeControl.oninput = function(){
    gainNode.gain.value = this.value;
}