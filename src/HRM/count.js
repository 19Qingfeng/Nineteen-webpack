export default function count() {
    let div = document.createElement('div')
    div.innerHTML = 1
    div.onclick = () => {
        div.innerHTML = parseInt(div.innerHTML, 10) + 1
    }
    document.body.appendChild(div)
}