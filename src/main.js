// import testImg from "./test-img.jpeg"
// import style from "./index.modules.suss";
// // import "./index.scss"
// import "./font/iconfont.css"


// console.log(style, 'style5')
// const img = new Image();
// img.src = testImg;
// img.classList.add(style.root.image)
// let root = document.getElementById('root')
// root.appendChild(img)

// const div = document.createElement("div")
// div.id = 'icon'
// div.className = "iconshuaxinzhongjieban iconfont"
// root.appendChild(div)

// 使用sourceMap
// 故意写错 devTool:"none" 没有映射关系
// // console.log("hello world1111")
// import "./index.css"
// const root = document.getElementById("root")
// const btn = document.createElement("button")
// btn.innerText = "点击我"
// root.appendChild(btn)
// console.log("add")
// btn.addEventListener('click', () => {
//     const div = document.createElement('div')
//     div.innerText = '创建的div'
//     div.className = 'div'
//     root.appendChild(div)
// })
// import count from "./HRM/count"
// import number from "./HRM/number"


// count()
// number()

// if (module.hot) {
//     module.hot.accept("./HRM/number", () => {
//         const numberDom = document.getElementById("number")
//         document.body.removeChild(numberDom)
//         number()
//     })
// }

// import "@babel/polyfill";
// Babel处理ES6语法
// const arr = [
//     new Promise(() => {}),
//     new Promise(() => {})
// ]
// arr.map(i => {
//     return i
// })
// import "./index.css"
// import {
//     sum
// } from "./treeShaking/index.js"

// 异步代码会自动分割
import axios from "axios"

function importLoadsh() {
    return import ( /* webpackChunkName:"lodash" */ "lodash").then(({
        default: _
    }) => {
        let ele = document.createElement("div")
        ele.innerHTML = 'wang.haoyu'
        return ele
    })
}
importLoadsh().then((ele) => {
    document.body.appendChild(ele)
})

// const loadshJoin = _.join([4, 5, 6], "**")
// console.log(loadshJoin)
// console.log(sum(3, 5))