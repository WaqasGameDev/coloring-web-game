import { useEffect, useRef, useState } from 'react'
import './App.css'

const CRAYONS = [
  { id: 'pink', color: '#ff7eb8' },
  { id: 'purple', color: '#b37bff' },
  { id: 'sky', color: '#7fd4ff' },
  { id: 'mint', color: '#7dffc4' },
  { id: 'sunny', color: '#ffe680' },
  { id: 'peach', color: '#ffb48a' },
  { id: 'lavender', color: '#e2b8ff' },
]

const ITEMS = [
  { id: 'cake', label: 'Cake' },
  { id: 'apple', label: 'Apple' },
  { id: 'noodles', label: 'Noodles' },
  { id: 'umbrella', label: 'Umbrella' },
  { id: 'cat', label: 'Cat' },
  { id: 'fish', label: 'Fish' },
]

function App() {
  const [selectedItem, setSelectedItem] = useState('cake')
  const [selectedColor, setSelectedColor] = useState(CRAYONS[0].color)
  const [selectedTool, setSelectedTool] = useState('brush') // 'brush' | 'eraser'
  const isPaintingRef = useRef(false)
  const canvasRef = useRef(null)
  const canvasContainerRef = useRef(null)
  const paintLayersRef = useRef({})
  const lastPointRef = useRef(null)
  const lastItemRef = useRef(selectedItem)

  useEffect(() => {
    const stopPainting = () => {
      isPaintingRef.current = false
      lastPointRef.current = null
    }
    window.addEventListener('pointerup', stopPainting)
    window.addEventListener('pointercancel', stopPainting)
    return () => {
      window.removeEventListener('pointerup', stopPainting)
      window.removeEventListener('pointercancel', stopPainting)
    }
  }, [])

  // Initialize paint canvas resolution to match SVG viewBox
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = 300
    canvas.height = 300
  }, [])

  // When switching pictures, save the current paint layer and restore the new one
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const lastItem = lastItemRef.current

    if (lastItem && lastItem !== selectedItem) {
      try {
        paintLayersRef.current[lastItem] = canvas.toDataURL()
      } catch {
        // If toDataURL fails (very rare), just skip persistence
      }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const stored = paintLayersRef.current[selectedItem]
    if (stored) {
      const img = new Image()
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
      }
      img.src = stored
    }

    lastItemRef.current = selectedItem
  }, [selectedItem])

  const getPointerPositionOnCanvas = (event) => {
    const container = canvasContainerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return null

    const rect = container.getBoundingClientRect()
    const xRatio = (event.clientX - rect.left) / rect.width
    const yRatio = (event.clientY - rect.top) / rect.height

    return {
      x: xRatio * canvas.width,
      y: yRatio * canvas.height,
    }
  }

  const paintAt = (point, startStroke = false) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (selectedTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.strokeStyle = 'rgba(0, 0, 0, 1)'
      ctx.lineWidth = 14
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = selectedColor
      ctx.lineWidth = 6
    }
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    const last = lastPointRef.current

    if (!last || startStroke) {
      ctx.beginPath()
      ctx.moveTo(point.x, point.y)
      ctx.lineTo(point.x, point.y)
      ctx.stroke()
    } else {
      ctx.beginPath()
      ctx.moveTo(last.x, last.y)
      ctx.lineTo(point.x, point.y)
      ctx.stroke()
    }

    lastPointRef.current = point
  }

  const handlePaintPointerDown = (event) => {
    // Only left mouse button or touch
    if (event.pointerType === 'mouse' && event.button !== 0) return
    const point = getPointerPositionOnCanvas(event)
    if (!point) return

    event.preventDefault()
    isPaintingRef.current = true
    paintAt(point, true)
  }

  const handlePaintPointerMove = (event) => {
    if (!isPaintingRef.current) return
    if (event.pointerType === 'mouse' && event.buttons === 0) return

    const point = getPointerPositionOnCanvas(event)
    if (!point) return

    event.preventDefault()
    paintAt(point, false)
  }

  return (
    <div
      className="game-root"
      onPointerLeave={() => {
        isPaintingRef.current = false
        lastPointRef.current = null
      }}
    >
      <div className="game-content">
        <header className="game-header">
          <h1 className="game-title">Magic Coloring Studio</h1>
          <p className="game-subtitle">
            Pick a crayon, then drag your finger or mouse to paint anywhere.
          </p>
        </header>

        <div className="item-strip" aria-label="Select picture to color">
          {ITEMS.map((item) => (
            <button
              key={item.id}
              className={
                'item-pill' + (selectedItem === item.id ? ' item-pill--active' : '')
              }
              onClick={() => setSelectedItem(item.id)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="game-actions">
          <button
            type="button"
            className="clear-button"
            aria-label="Clear painting for this picture"
            onClick={() => {
              // Clear freehand paint layer for this picture
              const canvas = canvasRef.current
              if (canvas) {
                const ctx = canvas.getContext('2d')
                if (ctx) {
                  ctx.clearRect(0, 0, canvas.width, canvas.height)
                }
              }
              const layers = paintLayersRef.current
              if (layers && layers[selectedItem]) {
                delete layers[selectedItem]
              }
            }}
            >
              <span className="clear-button-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M9 3h6a1 1 0 0 1 .98.804L16.5 5H19a1 1 0 1 1 0 2h-.803l-.89 11.124A2 2 0 0 1 15.313 20H8.687a2 2 0 0 1-1.994-1.876L5.803 7H5A1 1 0 1 1 5 5h2.5l.52-1.196A1 1 0 0 1 9 3Zm1.22 4.5a.75.75 0 0 0-.74.76l.25 8.5a.75.75 0 1 0 1.5-.04l-.25-8.5a.75.75 0 0 0-.76-.72Zm3.8 0a.75.75 0 0 0-.76.72l-.25 8.5a.75.75 0 0 0 1.5.04l.25-8.5a.75.75 0 0 0-.74-.76Z" />
                </svg>
              </span>
            </button>
        </div>

        <main className="game-layout">
          <section className="canvas-wrapper" aria-label="Coloring canvas">
            <div
              className="canvas-inner"
              ref={canvasContainerRef}
              onPointerDown={handlePaintPointerDown}
              onPointerMove={handlePaintPointerMove}
            >
              <div className="canvas-stack">
                {selectedItem === 'cake' && (
                  <CakeScene />
                )}
                {selectedItem === 'apple' && (
                  <AppleScene />
                )}
                {selectedItem === 'noodles' && (
                  <NoodlesScene />
                )}
                {selectedItem === 'umbrella' && (
                  <UmbrellaScene />
                )}
                {selectedItem === 'cat' && (
                  <CatScene />
                )}
                {selectedItem === 'fish' && (
                  <FishScene />
                )}
                <canvas ref={canvasRef} className="paint-layer" />
              </div>
            </div>
          </section>

          <aside className="crayon-panel" aria-label="Crayon color box">
            <h2 className="crayon-title">Crayon Box</h2>
            <div className="crayon-grid">
              {CRAYONS.map((crayon) => (
                <button
                  key={crayon.id}
                  type="button"
                  className={
                    'crayon' +
                    (selectedTool === 'brush' && selectedColor === crayon.color
                      ? ' crayon--active'
                      : '')
                  }
                  onClick={() => {
                    setSelectedTool('brush')
                    setSelectedColor(crayon.color)
                  }}
                >
                  <span
                    className="crayon-color"
                    style={{ backgroundColor: crayon.color }}
                  />
                </button>
              ))}
              <button
                type="button"
                className={'crayon eraser' + (selectedTool === 'eraser' ? ' crayon--active' : '')}
                onClick={() => setSelectedTool('eraser')}
                aria-label="Eraser"
              >
                <span className="eraser-icon" />
              </button>
            </div>
          </aside>
        </main>
      </div>
    </div>
  )
}

function CakeScene() {
  return (
    <svg
      viewBox="0 0 300 300"
      className="scene-svg"
      role="img"
      aria-label="Cake coloring page"
    >
      <rect
        x="10"
        y="10"
        width="280"
        height="280"
        rx="24"
        ry="24"
        fill="#fff7fb"
        stroke="#f5b2d6"
        strokeWidth="3"
      />

      {/* Plate */}
      <ellipse
        cx="150"
        cy="220"
        rx="90"
        ry="18"
        fill="#ffffff"
        stroke="#d58bb5"
        strokeWidth="3"
        className="scene-section"
      />

      {/* Cake base */}
      <path
        d="M70 200 H230 Q240 200 240 190 V150 H60 V190 Q60 200 70 200 Z"
        fill="#ffffff"
        stroke="#4b2b5f"
        strokeWidth="3"
        className="scene-section"
      />

      {/* Middle cream layer */}
      <path
        d="M65 165 Q90 175 105 165 Q120 155 135 165 Q150 175 165 165 Q180 155 195 165 Q210 175 235 165 V150 H65 Z"
        fill="#ffffff"
        stroke="#4b2b5f"
        strokeWidth="3"
        className="scene-section"
      />

      {/* Top cake */}
      <path
        d="M95 150 H205 V120 Q205 110 195 110 H105 Q95 110 95 120 Z"
        fill="#ffffff"
        stroke="#4b2b5f"
        strokeWidth="3"
        className="scene-section"
      />

      {/* Candle */}
      <rect
        x="140"
        y="80"
        width="20"
        height="40"
        rx="4"
        fill="#ffffff"
        stroke="#4b2b5f"
        strokeWidth="3"
        className="scene-section"
      />
      <path
        d="M150 80 Q160 70 150 60 Q140 70 150 80 Z"
        fill="#ffffff"
        stroke="#e28c4a"
        strokeWidth="2.5"
        className="scene-section"
      />

      {/* Sprinkles */}
      <circle className="scene-decor" cx="90" cy="155" r="3" fill="#ff9fd2" />
      <circle className="scene-decor" cx="120" cy="145" r="3" fill="#ffc66c" />
      <circle className="scene-decor" cx="150" cy="152" r="3" fill="#8fd4ff" />
      <circle className="scene-decor" cx="180" cy="145" r="3" fill="#ff9fd2" />
      <circle className="scene-decor" cx="210" cy="155" r="3" fill="#8fd4ff" />
    </svg>
  )
}

function AppleScene() {
  return (
    <svg
      viewBox="0 0 300 300"
      className="scene-svg"
      role="img"
      aria-label="Apple coloring page"
    >
      <rect
        x="10"
        y="10"
        width="280"
        height="280"
        rx="24"
        ry="24"
        fill="#f5fff6"
        stroke="#a5d69a"
        strokeWidth="3"
      />

      {/* Apple left side */}
      <path
        d="M140 85 Q105 70 90 105 Q70 145 90 190 Q105 220 135 220"
        fill="#ffffff"
        stroke="#3e5d2b"
        strokeWidth="3"
        className="scene-section"
      />

      {/* Apple right side */}
      <path
        d="M160 85 Q195 70 210 105 Q230 145 210 190 Q195 220 165 220"
        fill="#ffffff"
        stroke="#3e5d2b"
        strokeWidth="3"
        className="scene-section"
      />

      {/* Apple inner highlight */}
      <path
        d="M145 110 Q130 105 120 120 Q110 140 120 155 Q130 165 145 160"
        fill="#ffffff"
        stroke="#c0d6b0"
        strokeWidth="2"
        className="scene-section"
      />

      {/* Stem */}
      <path
        d="M150 90 Q148 75 145 65"
        fill="none"
        stroke="#4a3523"
        strokeWidth="4"
        className="scene-section"
      />

      {/* Leaf */}
      <path
        d="M145 70 Q155 60 170 62 Q165 78 150 82 Z"
        fill="#ffffff"
        stroke="#3e5d2b"
        strokeWidth="3"
        className="scene-section"
      />

      {/* Seeds */}
      <ellipse
        cx="110"
        cy="165"
        rx="3"
        ry="5"
        fill="#ffffff"
        stroke="#b58c6a"
        strokeWidth="2"
        className="scene-section"
      />
      <ellipse
        cx="190"
        cy="165"
        rx="3"
        ry="5"
        fill="#ffffff"
        stroke="#b58c6a"
        strokeWidth="2"
        className="scene-section"
      />
    </svg>
  )
}

function NoodlesScene() {
  return (
    <svg
      viewBox="0 0 300 300"
      className="scene-svg"
      role="img"
      aria-label="Noodles coloring page"
    >
      <rect
        x="10"
        y="10"
        width="280"
        height="280"
        rx="24"
        ry="24"
        fill="#fffdf5"
        stroke="#f0c58a"
        strokeWidth="3"
      />

      {/* Bowl */}
      <path
        d="M60 190 Q75 235 150 245 Q225 235 240 190 Z"
        fill="#ffffff"
        stroke="#9b6b3c"
        strokeWidth="3"
        className="scene-section"
      />

      {/* Noodles */}
      <path
        d="M70 165 Q110 145 150 155 Q190 165 230 150"
        fill="none"
        stroke="#f0c58a"
        strokeWidth="6"
        strokeLinecap="round"
        className="scene-section"
      />
      <path
        d="M80 170 Q120 150 155 160 Q190 170 225 155"
        fill="none"
        stroke="#f0c58a"
        strokeWidth="5"
        strokeLinecap="round"
        className="scene-section"
      />

      {/* Broth */}
      <ellipse
        cx="150"
        cy="175"
        rx="85"
        ry="18"
        fill="#ffffff"
        stroke="#d8b07e"
        strokeWidth="3"
        className="scene-section"
      />

      {/* Toppings */}
      <circle
        cx="110"
        cy="168"
        r="8"
        fill="#ffffff"
        stroke="#e08c6a"
        strokeWidth="3"
        className="scene-section"
      />
      <rect
        x="175"
        y="162"
        width="16"
        height="10"
        rx="3"
        fill="#ffffff"
        stroke="#c9655a"
        strokeWidth="3"
        className="scene-section"
      />
    </svg>
  )
}

function CatScene() {
  return (
    <svg
      viewBox="0 0 300 300"
      className="scene-svg"
      role="img"
      aria-label="Cat coloring page"
    >
      <rect
        x="10"
        y="10"
        width="280"
        height="280"
        rx="24"
        ry="24"
        fill="#fff9f5"
        stroke="#f0bba3"
        strokeWidth="3"
      />

      {/* Head (front-facing) */}
      <circle
        cx="150"
        cy="125"
        r="38"
        fill="#ffffff"
        stroke="#82524c"
        strokeWidth="3"
        className="scene-section"
      />

      {/* Ears (symmetric) */}
      <path
        d="M125 95 L110 75 L135 85 Z"
        fill="#ffffff"
        stroke="#82524c"
        strokeWidth="3"
        className="scene-section"
      />
      <path
        d="M175 95 L190 75 L165 85 Z"
        fill="#ffffff"
        stroke="#82524c"
        strokeWidth="3"
        className="scene-section"
      />

      {/* Body (front oval) */}
      <ellipse
        cx="150"
        cy="195"
        rx="55"
        ry="45"
        fill="#ffffff"
        stroke="#82524c"
        strokeWidth="3"
        className="scene-section"
      />

      {/* Front paws */}
      <rect
        x="125"
        y="212"
        width="18"
        height="26"
        rx="9"
        fill="#ffffff"
        stroke="#82524c"
        strokeWidth="3"
        className="scene-section"
      />
      <rect
        x="157"
        y="212"
        width="18"
        height="26"
        rx="9"
        fill="#ffffff"
        stroke="#82524c"
        strokeWidth="3"
        className="scene-section"
      />

      {/* Tail (to the side) */}
      <path
        d="M195 185 Q215 175 220 190 Q215 210 200 215"
        fill="#ffffff"
        stroke="#82524c"
        strokeWidth="4"
        className="scene-section"
      />

      {/* Face details */}
      <circle cx="138" cy="125" r="3" fill="#333" />
      <circle cx="162" cy="125" r="3" fill="#333" />
      <path d="M150 130 Q148 134 150 136 Q152 134 150 130" stroke="#333" strokeWidth="2" />
      <path d="M140 138 Q145 140 150 139 Q155 140 160 138" stroke="#333" strokeWidth="1.5" />
      {/* Whiskers */}
      <path d="M140 132 L122 128" stroke="#82524c" strokeWidth="2" className="scene-decor" />
      <path d="M140 136 L122 136" stroke="#82524c" strokeWidth="2" className="scene-decor" />
      <path d="M160 132 L178 128" stroke="#82524c" strokeWidth="2" className="scene-decor" />
      <path d="M160 136 L178 136" stroke="#82524c" strokeWidth="2" className="scene-decor" />
    </svg>
  )
}

function FishScene() {
  return (
    <svg
      viewBox="0 0 300 300"
      className="scene-svg"
      role="img"
      aria-label="Fish coloring page"
    >
      <rect
        x="10"
        y="10"
        width="280"
        height="280"
        rx="24"
        ry="24"
        fill="#f3fbff"
        stroke="#8fd0f0"
        strokeWidth="3"
      />

      {/* Body */}
      <ellipse
        cx="150"
        cy="160"
        rx="70"
        ry="40"
        fill="#ffffff"
        stroke="#326c88"
        strokeWidth="3"
        className="scene-section"
      />

      {/* Tail */}
      <path
        d="M215 140 L255 120 L250 160 L255 200 Z"
        fill="#ffffff"
        stroke="#326c88"
        strokeWidth="3"
        className="scene-section"
      />

      {/* Top fin */}
      <path
        d="M120 135 Q145 110 170 130"
        fill="#ffffff"
        stroke="#326c88"
        strokeWidth="3"
        className="scene-section"
      />

      {/* Eye */}
      <circle cx="120" cy="155" r="5" fill="#326c88" />

      {/* Stripes */}
      <path
        d="M135 135 Q130 160 135 185"
        stroke="#ffffff"
        strokeWidth="6"
        className="scene-section"
      />
      <path
        d="M155 135 Q150 160 155 185"
        stroke="#ffffff"
        strokeWidth="6"
        className="scene-section"
      />
      <path
        d="M175 135 Q170 160 175 185"
        stroke="#ffffff"
        strokeWidth="6"
        className="scene-section"
      />
    </svg>
  )
}

function UmbrellaScene() {
  return (
    <svg
      viewBox="0 0 300 300"
      className="scene-svg"
      role="img"
      aria-label="Umbrella coloring page"
    >
      <rect
        x="10"
        y="10"
        width="280"
        height="280"
        rx="24"
        ry="24"
        fill="#f3fbff"
        stroke="#9bc5f0"
        strokeWidth="3"
      />

      {/* Handle */}
      <path
        d="M150 110 V215 Q150 230 140 235 Q130 240 125 232"
        fill="none"
        stroke="#5a6a8a"
        strokeWidth="5"
        strokeLinecap="round"
        className="scene-section"
      />

      {/* Canopy main */}
      <path
        d="M70 140 Q150 70 230 140 Q200 140 185 150 Q170 140 150 150 Q130 140 115 150 Q100 140 70 140 Z"
        fill="#ffffff"
        stroke="#5a6a8a"
        strokeWidth="3"
        className="scene-section"
      />

      {/* Canopy left */}
      <path
        d="M70 140 Q110 120 135 130 Q120 137 110 145 Q95 140 70 140 Z"
        fill="#ffffff"
        stroke="#5a6a8a"
        strokeWidth="2"
        className="scene-section"
      />

      {/* Canopy middle */}
      <path
        d="M110 145 Q150 120 190 145 Q170 142 150 150 Q130 142 110 145 Z"
        fill="#ffffff"
        stroke="#5a6a8a"
        strokeWidth="2"
        className="scene-section"
      />

      {/* Canopy right */}
      <path
        d="M190 145 Q205 137 220 132 Q235 137 230 140 Q205 140 190 145 Z"
        fill="#ffffff"
        stroke="#5a6a8a"
        strokeWidth="2"
        className="scene-section"
      />

      {/* Tip */}
      <circle
        cx="150"
        cy="112"
        r="4"
        fill="#ffffff"
        stroke="#5a6a8a"
        strokeWidth="2"
        className="scene-section"
      />
    </svg>
  )
}

export default App
