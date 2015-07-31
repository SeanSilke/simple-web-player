var fileInput = document.querySelector('.file-input');
var dropZone = document.querySelector('.drop-zone')


var handleFileSelect = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var files = evt.target.files || evt.dataTransfer.files
    var file = files[0]

    var reader = new FileReader();
    reader.onload = function(e){
        console.log(e.target.result)
        console.log("result ArrayBuffer",reader.result)
    }

    reader.readAsArrayBuffer(file);
};

function handleDragOver(evt) {
    console.log("hi dragover")
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

fileInput.onchange = handleFileSelect;
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);
