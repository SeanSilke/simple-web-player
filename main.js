// define variables
var context = new (window.AudioContext || window.webkitAudioContext);
var source;
var gainNode = context.createGain();;
var analyser = context.createAnalyser();

var soundBuffer = null;
var isPlaying = false;

var fileInput = document.querySelector('.file-input');
var dropZone = document.querySelector('.drop-zone')
var volumeControl = document.querySelector('.volume-control');
var stop = document.querySelector('.stop');
var play = document.querySelector('.play');

/// constant
var WIDTH = 640;
var HEIGHT = 360;
var SMOOTHING = 0.8;
var FFT_SIZE = Math.pow(2, 7);
///

//Connect Audio nodes
var connectAudioNodes = function(){
  source = context.createBufferSource();
  source.connect(gainNode);
  gainNode.connect(analyser);
  analyser.connect(context.destination);
  gainNode.gain.value = volumeControl.value;
}


var setSound = function() {
    if (soundBuffer) {
        source.buffer = soundBuffer;
        return true
    } else {
        alert("No audio file selected! Please select one.")
        return false
    }
}


var draw = function(){
    analyser.smoothingTimeConstant = SMOOTHING;
    analyser.fftSize = FFT_SIZE;

    ///!!! move freqDomain out of function
    var freqDomain = new Uint8Array(analyser.frequencyBinCount);
    // Get the frequency data from the currently playing music
    analyser.getByteFrequencyData(freqDomain);

    var width = Math.floor(1/freqDomain.length, 10);

    var canvas = document.querySelector('canvas');
    var drawContext = canvas.getContext('2d');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    // Draw the frequency domain chart.
    for (var i = 0; i < analyser.frequencyBinCount; i++) {
      var value = freqDomain[i];
      var percent = value / 256;
      var height = HEIGHT * percent;
      var offset = HEIGHT - height - 1;
      var barWidth = WIDTH/analyser.frequencyBinCount;
      var hue = i/analyser.frequencyBinCount * 360;
      drawContext.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
      drawContext.fillRect(i * barWidth, offset, barWidth, height);
    }
  ///!!! stop if music doesn't playing
  if(isPlaying) {
    requestAnimationFrame(draw);
  }else {
    drawContext.clearRect(0, 0, canvas.width, canvas.height);
  }
}

// wire up buttons
volumeControl.oninput = function () {
    gainNode.gain.value = this.value;
}

play.onclick = function () {
    connectAudioNodes()
    if (setSound()){
      source.start(0);
      requestAnimationFrame(draw);
      isPlaying = true;
      play.setAttribute('disabled', 'disabled');
      stop.removeAttribute('disabled');
    }
}

stop.onclick = function () {
    source.stop(0);
    isPlaying = false;
    play.removeAttribute('disabled');
}
// file select and dragover functions
var handleFileSelect = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var files = evt.target.files || evt.dataTransfer.files
    var file = files[0]

    var onDecodeSuccess = function(buffer){
      soundBuffer = buffer
    }

    var onDecodeError = function(){
      alert("Can't decode selected file. Probably it is not audio file.")
    }

    function fileListener(e) {
        context.decodeAudioData(
          e.target.result,
          onDecodeSuccess,
          onDecodeError
        )
    }

    var reader = new FileReader();
    reader.onload = fileListener
    reader.readAsArrayBuffer(file);
};

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

// file select and dragover binding
fileInput.onchange = handleFileSelect;
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);
