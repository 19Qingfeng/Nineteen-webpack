import testImg from "./test-img.jpeg"

const img = new Image();
img.src = testImg;
let root = document.getElementById('root')
root.appendChild(img)