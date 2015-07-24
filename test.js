function reqListener () {
  console.log(this);
}

var oReq = new XMLHttpRequest();
oReq.responseType = 'arraybuffer'
oReq.onload = reqListener;
oReq.open("get", "samples/indigo jam unit - Roots.mp3", true);
oReq.send();
