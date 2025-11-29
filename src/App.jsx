import { useState } from 'react'
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
  const [fills, setFills] = useState({})

  const handleSectionFill = (sectionId) => {
    setFills((prev) => ({
      ...prev,
      [selectedItem]: {
        ...(prev[selectedItem] || {}),
        [sectionId]: selectedColor,
      },
    }))
  }

  const currentFills = fills[selectedItem] || {}

  return (
    <div className="game-root">
      <div className="game-content">
        <header className="game-header">
          <h1 className="game-title">Magic Coloring Studio</h1>
          <p className="game-subtitle">
            Tap a crayon, then tap a section to color it in.
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

        <main className="game-layout">
          <section className="canvas-wrapper" aria-label="Coloring canvas">
            <div className="canvas-inner">
              {selectedItem === 'cake' && (
                <CakeScene fills={currentFills} onFill={handleSectionFill} />
              )}
              {selectedItem === 'apple' && (
                <AppleScene fills={currentFills} onFill={handleSectionFill} />
              )}
              {selectedItem === 'noodles' && (
                <NoodlesScene fills={currentFills} onFill={handleSectionFill} />
              )}
              {selectedItem === 'umbrella' && (
                <UmbrellaScene fills={currentFills} onFill={handleSectionFill} />
              )}
              {selectedItem === 'cat' && (
                <CatScene fills={currentFills} onFill={handleSectionFill} />
              )}
              {selectedItem === 'fish' && (
                <FishScene fills={currentFills} onFill={handleSectionFill} />
              )}
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
                    'crayon' + (selectedColor === crayon.color ? ' crayon--active' : '')
                  }
                  onClick={() => setSelectedColor(crayon.color)}
                >
                  <span
                    className="crayon-color"
                    style={{ backgroundColor: crayon.color }}
                  />
                </button>
              ))}
            </div>
          </aside>
        </main>
      </div>
    </div>
  )
}

function CakeScene({ fills, onFill }) {
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
        fill={fills.plate || '#ffffff'}
        stroke="#d58bb5"
        strokeWidth="3"
        className="scene-section"
        onPointerDown={() => onFill('plate')}
      />

      {/* Cake base */}
      <path
        d="M70 200 H230 Q240 200 240 190 V150 H60 V190 Q60 200 70 200 Z"
        fill={fills.base || '#ffffff'}
        stroke="#4b2b5f"
        strokeWidth="3"
        className="scene-section"
        onPointerDown={() => onFill('base')}
      />

      {/* Middle cream layer */}
      <path
        d="M65 165 Q90 175 105 165 Q120 155 135 165 Q150 175 165 165 Q180 155 195 165 Q210 175 235 165 V150 H65 Z"
        fill={fills.cream || '#ffffff'}
        stroke="#4b2b5f"
        strokeWidth="3"
        className="scene-section"
        onPointerDown={() => onFill('cream')}
      />

      {/* Top cake */}
      <path
        d="M95 150 H205 V120 Q205 110 195 110 H105 Q95 110 95 120 Z"
        fill={fills.top || '#ffffff'}
        stroke="#4b2b5f"
        strokeWidth="3"
        className="scene-section"
        onPointerDown={() => onFill('top')}
      />

      {/* Candle */}
      <rect
        x="140"
        y="80"
        width="20"
        height="40"
        rx="4"
        fill={fills.candle || '#ffffff'}
        stroke="#4b2b5f"
        strokeWidth="3"
        className="scene-section"
        onPointerDown={() => onFill('candle')}
      />
      <path
        d="M150 80 Q160 70 150 60 Q140 70 150 80 Z"
        fill={fills.flame || '#ffffff'}
        stroke="#e28c4a"
        strokeWidth="2.5"
        className="scene-section"
        onPointerDown={() => onFill('flame')}
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

function AppleScene({ fills, onFill }) {
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
        fill={fills.left || '#ffffff'}
        stroke="#3e5d2b"
        strokeWidth="3"
        className="scene-section"
        onPointerDown={() => onFill('left')}
      />

      {/* Apple right side */}
      <path
        d="M160 85 Q195 70 210 105 Q230 145 210 190 Q195 220 165 220"
        fill={fills.right || '#ffffff'}
        stroke="#3e5d2b"
        strokeWidth="3"
        className="scene-section"
        onPointerDown={() => onFill('right')}
      />

      {/* Apple inner highlight */}
      <path
        d="M145 110 Q130 105 120 120 Q110 140 120 155 Q130 165 145 160"
        fill={fills.highlight || '#ffffff'}
        stroke="#c0d6b0"
        strokeWidth="2"
        className="scene-section"
        onPointerDown={() => onFill('highlight')}
      />

      {/* Stem */}
      <path
        d="M150 90 Q148 75 145 65"
        fill="none"
        stroke={fills.stem || '#4a3523'}
        strokeWidth="4"
        className="scene-section"
        onPointerDown={() => onFill('stem')}
      />

      {/* Leaf */}
      <path
        d="M145 70 Q155 60 170 62 Q165 78 150 82 Z"
        fill={fills.leaf || '#ffffff'}
        stroke="#3e5d2b"
        strokeWidth="3"
        className="scene-section"
        onPointerDown={() => onFill('leaf')}
      />

      {/* Seeds */}
      <ellipse
        cx="110"
        cy="165"
        rx="3"
        ry="5"
        fill={fills.seeds || '#ffffff'}
        stroke="#b58c6a"
        strokeWidth="2"
        className="scene-section"
        onPointerDown={() => onFill('seeds')}
      />
      <ellipse
        cx="190"
        cy="165"
        rx="3"
        ry="5"
        fill={fills.seeds || '#ffffff'}
        stroke="#b58c6a"
        strokeWidth="2"
        className="scene-section"
        onPointerDown={() => onFill('seeds')}
      />
    </svg>
  )
}

function NoodlesScene({ fills, onFill }) {
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
        fill={fills.bowl || '#ffffff'}
        stroke="#9b6b3c"
        strokeWidth="3"
        className="scene-section"
        onPointerDown={() => onFill('bowl')}
      />

      {/* Noodles */}
      <path
        d="M70 165 Q110 145 150 155 Q190 165 230 150"
        fill="none"
        stroke={fills.noodles || '#f0c58a'}
        strokeWidth="6"
        strokeLinecap="round"
        className="scene-section"
        onPointerDown={() => onFill('noodles')}
      />
      <path
        d="M80 170 Q120 150 155 160 Q190 170 225 155"
        fill="none"
        stroke={fills.noodles || '#f0c58a'}
        strokeWidth="5"
        strokeLinecap="round"
        className="scene-section"
        onPointerDown={() => onFill('noodles')}
      />

      {/* Broth */}
      <ellipse
        cx="150"
        cy="175"
        rx="85"
        ry="18"
        fill={fills.broth || '#ffffff'}
        stroke="#d8b07e"
        strokeWidth="3"
        className="scene-section"
        onPointerDown={() => onFill('broth')}
      />

      {/* Toppings */}
      <circle
        cx="110"
        cy="168"
        r="8"
        fill={fills.egg || '#ffffff'}
        stroke="#e08c6a"
        strokeWidth="3"
        className="scene-section"
        onPointerDown={() => onFill('egg')}
      />
      <rect
        x="175"
        y="162"
        width="16"
        height="10"
        rx="3"
        fill={fills.meat || '#ffffff'}
        stroke="#c9655a"
        strokeWidth="3"
        className="scene-section"
        onPointerDown={() => onFill('meat')}
      />
    </svg>
  )
}

function CatScene({ fills, onFill }) {
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
        fill={fills.head || '#ffffff'}
        stroke="#82524c"
        strokeWidth="3"
        className="scene-section"
        onPointerDown={() => onFill('head')}
      />

      {/* Ears (symmetric) */}
      <path
        d="M125 95 L110 75 L135 85 Z"
        fill={fills.ears || '#ffffff'}
        stroke="#82524c"
        strokeWidth="3"
        className="scene-section"
        onPointerDown={() => onFill('ears')}
      />
      <path
        d="M175 95 L190 75 L165 85 Z"
        fill={fills.ears || '#ffffff'}
        stroke="#82524c"
        strokeWidth="3"
        className="scene-section"
        onPointerDown={() => onFill('ears')}
      />

      {/* Body (front oval) */}
      <ellipse
        cx="150"
        cy="195"
        rx="55"
        ry="45"
        fill={fills.body || '#ffffff'}
        stroke="#82524c"
        strokeWidth="3"
        className="scene-section"
        onPointerDown={() => onFill('body')}
      />

      {/* Front paws */}
      <rect
        x="125"
        y="212"
        width="18"
        height="26"
        rx="9"
        fill={fills.paws || '#ffffff'}
        stroke="#82524c"
        strokeWidth="3"
        className="scene-section"
        onPointerDown={() => onFill('paws')}
      />
      <rect
        x="157"
        y="212"
        width="18"
        height="26"
        rx="9"
        fill={fills.paws || '#ffffff'}
        stroke="#82524c"
        strokeWidth="3"
        className="scene-section"
        onPointerDown={() => onFill('paws')}
      />

      {/* Tail (to the side) */}
      <path
        d="M195 185 Q215 175 220 190 Q215 210 200 215"
        fill={fills.tail || '#ffffff'}
        stroke="#82524c"
        strokeWidth="4"
        className="scene-section"
        onPointerDown={() => onFill('tail')}
      />

      {/* Face details */}
      <circle cx="138" cy="125" r="3" fill="#333" />
      <circle cx="162" cy="125" r="3" fill="#333" />
      <path d="M150 130 Q148 134 150 136 Q152 134 150 130" stroke="#333" strokeWidth="2" />
      <path d="M140 138 Q145 140 150 139 Q155 140 160 138" stroke="#333" strokeWidth="1.5" />
    </svg>
  )
}

function FishScene({ fills, onFill }) {
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
        fill={fills.body || '#ffffff'}
        stroke="#326c88"
        strokeWidth="3"
        className="scene-section"
        onPointerDown={() => onFill('body')}
      />

      {/* Tail */}
      <path
        d="M215 140 L255 120 L250 160 L255 200 Z"
        fill={fills.tail || '#ffffff'}
        stroke="#326c88"
        strokeWidth="3"
        className="scene-section"
        onPointerDown={() => onFill('tail')}
      />

      {/* Top fin */}
      <path
        d="M120 135 Q145 110 170 130"
        fill={fills.fin || '#ffffff'}
        stroke="#326c88"
        strokeWidth="3"
        className="scene-section"
        onPointerDown={() => onFill('fin')}
      />

      {/* Eye */}
      <circle cx="120" cy="155" r="5" fill="#326c88" />

      {/* Stripes */}
      <path
        d="M135 135 Q130 160 135 185"
        stroke={fills.stripes || '#ffffff'}
        strokeWidth="6"
        className="scene-section"
        onPointerDown={() => onFill('stripes')}
      />
      <path
        d="M155 135 Q150 160 155 185"
        stroke={fills.stripes || '#ffffff'}
        strokeWidth="6"
        className="scene-section"
        onPointerDown={() => onFill('stripes')}
      />
      <path
        d="M175 135 Q170 160 175 185"
        stroke={fills.stripes || '#ffffff'}
        strokeWidth="6"
        className="scene-section"
        onPointerDown={() => onFill('stripes')}
      />
    </svg>
  )
}

function UmbrellaScene({ fills, onFill }) {
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
        stroke={fills.handle || '#5a6a8a'}
        strokeWidth="5"
        strokeLinecap="round"
        className="scene-section"
        onPointerDown={() => onFill('handle')}
      />

      {/* Canopy main */}
      <path
        d="M70 140 Q150 70 230 140 Q200 140 185 150 Q170 140 150 150 Q130 140 115 150 Q100 140 70 140 Z"
        fill={fills.canopyMain || '#ffffff'}
        stroke="#5a6a8a"
        strokeWidth="3"
        className="scene-section"
        onPointerDown={() => onFill('canopyMain')}
      />

      {/* Canopy left */}
      <path
        d="M70 140 Q110 120 135 130 Q120 137 110 145 Q95 140 70 140 Z"
        fill={fills.canopyLeft || '#ffffff'}
        stroke="#5a6a8a"
        strokeWidth="2"
        className="scene-section"
        onPointerDown={() => onFill('canopyLeft')}
      />

      {/* Canopy middle */}
      <path
        d="M110 145 Q150 120 190 145 Q170 142 150 150 Q130 142 110 145 Z"
        fill={fills.canopyMiddle || '#ffffff'}
        stroke="#5a6a8a"
        strokeWidth="2"
        className="scene-section"
        onPointerDown={() => onFill('canopyMiddle')}
      />

      {/* Canopy right */}
      <path
        d="M190 145 Q205 137 220 132 Q235 137 230 140 Q205 140 190 145 Z"
        fill={fills.canopyRight || '#ffffff'}
        stroke="#5a6a8a"
        strokeWidth="2"
        className="scene-section"
        onPointerDown={() => onFill('canopyRight')}
      />

      {/* Tip */}
      <circle
        cx="150"
        cy="112"
        r="4"
        fill={fills.tip || '#ffffff'}
        stroke="#5a6a8a"
        strokeWidth="2"
        className="scene-section"
        onPointerDown={() => onFill('tip')}
      />
    </svg>
  )
}

export default App
