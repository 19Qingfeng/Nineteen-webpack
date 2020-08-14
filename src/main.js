import testImg from "./test-img.jpeg"
import "./index.scss";


const img = new Image();
img.src = testImg;
img.classList.add("image")
let root = document.getElementById('root')
root.appendChild(img)