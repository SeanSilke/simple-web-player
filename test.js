window.addEventListener('input', function (event) {
    event.preventDefault();
    console.log("keyup event detected! coming from this element:", event.target);
}, false);

var handleFiles = function(e){
    console.log(e[0].name, e[0].type);
};