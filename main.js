// define variables
var context = new (window.AudioContext || window.webkitAudioContext);
var source;
var gainNode;

var soundBuffer = null;

var volumeControl = document.querySelector('.volume-control');
var stop = document.querySelector('.stop');
var play = document.querySelector('.play');
///

var fillTheBuffer = function(url){
    var aReq = new XMLHttpRequest();
    aReq.responseType = 'arraybuffer'
    aReq.onload = reqListener;
    aReq.open("get", url, true);
    aReq.send();
    function reqListener() {
        context.decodeAudioData(aReq.response, function (buffer) {
            soundBuffer = buffer
            source.buffer = soundBuffer;
        });
    }
}

var getData = function () {
    source = context.createBufferSource();
    gainNode = context.createGain();
    source.connect(gainNode);
    gainNode.connect(context.destination);
    gainNode.gain.value = volumeControl.value;

    if (soundBuffer) {
        source.buffer = soundBuffer;
    } else {
      fillTheBuffer("samples/Onze-20 - Joao e Grazi.mp3")
    }
}
// wire up buttons
volumeControl.oninput = function () {
    gainNode.gain.value = this.value;
}

play.onclick = function () {
    getData();
    source.start(0);
    play.setAttribute('disabled', 'disabled');
}

stop.onclick = function () {
    source.stop(0);
    play.removeAttribute('disabled');
}
