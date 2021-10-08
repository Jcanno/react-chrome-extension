import React from 'react'
import ReactDOM from 'react-dom'

const root = document.createElement('div')
root.id = 'crx-root'
document.body.appendChild(root)

function App() {
  return (
    <div
      style={{
        display: 'inline-block',
        position: 'fixed',
        bottom: 150,
        right: 80,
        width: 200,
        height: 50,
        fontWeight: 600,
        lineHeight: '50px',
        fontSize: 12,
        borderRadius: 5,
        textAlign: 'center',
        verticalAlign: 'middle',
        color: '#fff',
        boxShadow: '0 2px 6px #acb5f6',
        backgroundColor: '#6777ef',
        borderColor: '#6777ef',
        zIndex: 9999,
        userSelect: 'none',
        transition:
          'color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out',
      }}
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
