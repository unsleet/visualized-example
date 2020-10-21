export function getTextWidth(str, fontSize) {
  const dom = document.createElement('span')
  dom.style.display = 'inline-block'
  dom.style.fontSize = fontSize
  dom.textContent = str
  document.body.appendChild(dom)
  const width = dom.clientWidth
  console.log(dom.clientWidth)
  document.body.removeChild(dom)
  return width
}
