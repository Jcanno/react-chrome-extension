import React from 'react'
import ReactDOM from 'react-dom'
import '../style/btn.less'

type Coordinate = {
  right?: string
  left?: string
  bottom?: string
  top?: string
}

const root = document.createElement('div')
root.id = 'crx-root'
root.style.cssText = `bottom: 150px; right: 80px; position: fixed; z-index: 9999`
document.body.appendChild(root)

const btnHeight = 50
const btnWidth = 200
const getWindowInner = () => {
  return {
    windowHeight: window.innerHeight - btnHeight,
    windowWidth: window.innerWidth - btnWidth
  }
}
const getDomPosition = (dom: HTMLDivElement) => {
  const { bottom, right, top, left } = dom.style
  return {
    bottom: parseFloat(bottom),
    right: parseFloat(right),
    top: parseFloat(top),
    left: parseFloat(left),
  }
}
const getEventTargetCoordinate = (e: MouseEvent) => {
  return {
    x: e.clientX,
    y: e.clientY
  }
}
const setDomPosition = (dom: HTMLDivElement, coordinate: Coordinate) => {
  Object.assign(dom.style, coordinate)
}

root.onmousedown = function (e: MouseEvent) {
  const { x: startX, y: startY } = getEventTargetCoordinate(e)
  const { bottom: startBottom, right: startRgight } = getDomPosition(root)
  const move = (moveEvent: MouseEvent) => {
    moveEvent.stopPropagation()
    moveEvent.preventDefault()
    const { x: curX, y: curY } = getEventTargetCoordinate(moveEvent)
    const { windowHeight, windowWidth } = getWindowInner()
    const bottom = startY - curY + startBottom
    const right = startX - curX + startRgight

    setDomPosition(root, {
      bottom: `${
        bottom > 0 ? (bottom > windowHeight ? windowHeight : bottom) : 0
      }px`,
      right: `${
        right > 0 ? (right > windowWidth ? windowWidth : right) : 0
      }px`
    })
  }

  const up = () => {
    document.removeEventListener("mousemove", move)
    document.removeEventListener("mouseup", up)
  }

  document.addEventListener("mousemove", move)
  document.addEventListener("mouseup", up)
}

window.addEventListener('resize', function() {
  const { windowHeight, windowWidth } = getWindowInner()
  const { bottom, right } = getDomPosition(root)

  setDomPosition(root, {
    bottom: `${
      bottom > 0 ? (bottom > windowHeight ? windowHeight : bottom) : 0
    }px`,
    right: `${
      right > 0 ? (right > windowWidth ? windowWidth : right) : 0
    }px`
  })
})

function App() {
  return (
    <div
      style={{
        width: btnWidth,
        height: btnHeight,
        lineHeight: '50px',
        borderColor: '#6777ef',
        cursor: 'pointer'
      }}
      className="crx-btn"
      draggable
    >
      Created by Extension (Move) 🚀
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('crx-root'),
)
