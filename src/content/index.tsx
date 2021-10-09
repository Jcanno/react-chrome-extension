import React from 'react'
import ReactDOM from 'react-dom'
import '../style/btn.less'

const root = document.createElement('div')
root.id = 'crx-root'
document.body.appendChild(root)

function App() {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 150,
        right: 80,
        width: 200,
        height: 50,
        lineHeight: '50px',
        borderColor: '#6777ef',
        zIndex: 9999,
      }}
      className="crx-btn"
    >
      Created by Extension 🚀
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('crx-root'),
)
