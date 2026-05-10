import React, { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ──────────────────────────────────────────────
   MF Memes Finder — Meme Editor (Fabric.js)
   Features: text, stickers, filters, undo/redo, export
────────────────────────────────────────────── */

const FONTS = ['Inter', 'Impact', 'Georgia', 'Courier New', 'Comic Sans MS', 'Arial Black']
const FILTERS = [
  { id: 'none',      label: 'Original',  css: '' },
  { id: 'grayscale', label: 'B&W',       css: 'grayscale(1)' },
  { id: 'sepia',     label: 'Vintage',   css: 'sepia(0.7)' },
  { id: 'saturate',  label: 'Vivid',     css: 'saturate(2.5) contrast(1.1)' },
  { id: 'invert',    label: 'Invert',    css: 'invert(1)' },
  { id: 'dark',      label: 'Dark',      css: 'brightness(0.6) contrast(1.3)' },
]
const STICKERS = ['😂', '💀', '🔥', '😎', '🤡', '👀', '💯', '🤣', '😤', '🥺', '👏', '🤝', '😏', '🫡', '💪', '🤦']

export default function MemeEditor({ imageUrl, onClose }) {
  const canvasRef = useRef(null)
  const [fabric, setFabric] = useState(null)
  const [canvasInst, setCanvasInst] = useState(null)
  const [history, setHistory] = useState([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const [activeFilter, setActiveFilter] = useState('none')
  const [textInput, setTextInput] = useState('YOUR MEME TEXT')
  const [textColor, setTextColor] = useState('#FFFFFF')
  const [fontSize, setFontSize] = useState(32)
  const [fontFamily, setFontFamily] = useState('Impact')
  const [showStickers, setShowStickers] = useState(false)
  const [tab, setTab] = useState('text') // text | filters | stickers
  const [loading, setLoading] = useState(true)

  // Dynamically load Fabric.js
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.0/fabric.min.js'
    script.onload = () => setFabric(window.fabric)
    document.head.appendChild(script)
    return () => document.head.removeChild(script)
  }, [])

  // Initialise canvas once fabric loaded
  useEffect(() => {
    if (!fabric || !canvasRef.current) return
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 390,
      height: 390,
      backgroundColor: '#000',
      selection: true,
    })
    setCanvasInst(canvas)
    // Load background image
    fabric.Image.fromURL(imageUrl, (img) => {
      img.scaleToWidth(390)
      img.scaleToHeight(390)
      img.set({ selectable: false, evented: false })
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
        scaleX: 390 / img.width,
        scaleY: 390 / img.height,
      })
      setLoading(false)
      saveSnapshot(canvas)
    }, { crossOrigin: 'anonymous' })

    return () => canvas.dispose()
  }, [fabric, imageUrl])

  // ─── History helpers ───
  const saveSnapshot = useCallback((cv) => {
    const json = JSON.stringify(cv?.toJSON() || {})
    setHistory(h => {
      const trimmed = h.slice(0, historyIdx + 1)
      return [...trimmed, json]
    })
    setHistoryIdx(i => i + 1)
  }, [historyIdx])

  const undo = () => {
    if (!canvasInst || historyIdx <= 0) return
    const newIdx = historyIdx - 1
    canvasInst.loadFromJSON(history[newIdx], canvasInst.renderAll.bind(canvasInst))
    setHistoryIdx(newIdx)
  }

  const redo = () => {
    if (!canvasInst || historyIdx >= history.length - 1) return
    const newIdx = historyIdx + 1
    canvasInst.loadFromJSON(history[newIdx], canvasInst.renderAll.bind(canvasInst))
    setHistoryIdx(newIdx)
  }

  // ─── Add text ───
  const addText = () => {
    if (!canvasInst || !fabric) return
    const text = new fabric.IText(textInput, {
      left: 30,
      top: 30,
      fontFamily,
      fontSize,
      fill: textColor,
      fontWeight: fontFamily === 'Impact' ? 'bold' : 'normal',
      stroke: '#000000',
      strokeWidth: 2,
      textAlign: 'center',
    })
    canvasInst.add(text)
    canvasInst.setActiveObject(text)
    canvasInst.renderAll()
    saveSnapshot(canvasInst)
  }

  // ─── Add sticker ───
  const addSticker = (emoji) => {
    if (!canvasInst || !fabric) return
    const text = new fabric.IText(emoji, {
      left: 80,
      top: 80,
      fontSize: 48,
    })
    canvasInst.add(text)
    canvasInst.setActiveObject(text)
    canvasInst.renderAll()
    saveSnapshot(canvasInst)
    setShowStickers(false)
  }

  // ─── Delete selected ───
  const deleteSelected = () => {
    if (!canvasInst) return
    const active = canvasInst.getActiveObject()
    if (active) {
      canvasInst.remove(active)
      canvasInst.renderAll()
      saveSnapshot(canvasInst)
    }
  }

  // ─── Export ───
  const exportPNG = () => {
    if (!canvasInst) return
    const link = document.createElement('a')
    link.download = 'mf-meme.png'
    link.href = canvasInst.toDataURL({ format: 'png', multiplier: 2 })
    link.click()
  }

  // ─── Filter style for background container ───
  const filterStyle = FILTERS.find(f => f.id === activeFilter)?.css || ''

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 26, stiffness: 200 }}
      className="fixed inset-0 z-[300] bg-[#0a0a0a] flex flex-col overflow-hidden"
      style={{ height: '100dvh' }}
    >
      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur border-b border-white/10">
        <button onClick={onClose} className="text-white text-xl font-bold w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">✕</button>
        <span className="text-white font-black tracking-wider text-base">🎨 Meme Editor</span>
        <div className="flex gap-2">
          <button onClick={undo} disabled={historyIdx <= 0} className="text-white/60 text-lg px-2 disabled:opacity-30">↩</button>
          <button onClick={redo} disabled={historyIdx >= history.length - 1} className="text-white/60 text-lg px-2 disabled:opacity-30">↪</button>
        </div>
      </div>

      {/* ── Canvas Area ── */}
      <div className="flex-1 flex items-center justify-center bg-[#111] overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
            <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <div style={{ filter: filterStyle, transition: 'filter 0.3s ease' }}>
          <canvas ref={canvasRef} style={{ maxWidth: '100%', touchAction: 'none', display: 'block', borderRadius: '12px' }} />
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex border-b border-white/10 bg-black">
        {['text', 'filters', 'stickers'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors ${tab === t ? 'text-pink-400 border-b-2 border-pink-400' : 'text-gray-500'}`}
          >
            {t === 'text' ? '✏️ Text' : t === 'filters' ? '🎭 Filters' : '😂 Stickers'}
          </button>
        ))}
      </div>

      {/* ── Bottom Panel ── */}
      <div className="bg-[#111] px-4 py-3" style={{ minHeight: '180px' }}>
        {/* TEXT TAB */}
        {tab === 'text' && (
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <input
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
                placeholder="Type your text..."
                className="flex-1 bg-white/10 text-white px-3 py-2 rounded-xl text-sm outline-none border border-white/10 focus:border-pink-500/50"
              />
              <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer" />
            </div>
            <div className="flex gap-2 items-center">
              <select value={fontFamily} onChange={e => setFontFamily(e.target.value)}
                className="flex-1 bg-white/10 text-white px-2 py-1.5 rounded-lg text-xs border border-white/10 outline-none">
                {FONTS.map(f => <option key={f} value={f} style={{ background: '#111' }}>{f}</option>)}
              </select>
              <div className="flex items-center gap-1">
                <button onClick={() => setFontSize(s => Math.max(12, s - 4))} className="w-7 h-7 rounded-lg bg-white/10 text-white font-bold text-lg flex items-center justify-center">−</button>
                <span className="text-white text-xs w-8 text-center">{fontSize}</span>
                <button onClick={() => setFontSize(s => Math.min(120, s + 4))} className="w-7 h-7 rounded-lg bg-white/10 text-white font-bold text-lg flex items-center justify-center">+</button>
              </div>
            </div>
            <div className="flex gap-2">
              <motion.button whileTap={{ scale: 0.95 }} onClick={addText}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white text-sm font-bold shadow-lg shadow-pink-900/40">
                + Add Text
              </motion.button>
              <motion.button whileTap={{ scale: 0.95 }} onClick={deleteSelected}
                className="px-4 py-2.5 rounded-xl bg-red-900/60 border border-red-700/50 text-white text-sm font-bold">
                🗑
              </motion.button>
            </div>
          </div>
        )}

        {/* FILTERS TAB */}
        {tab === 'filters' && (
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 pt-1">
            {FILTERS.map(f => (
              <button key={f.id} onClick={() => setActiveFilter(f.id)}
                className={`flex flex-col items-center gap-1.5 flex-shrink-0 group`}>
                <div className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${activeFilter === f.id ? 'border-pink-500 shadow-lg shadow-pink-500/30' : 'border-white/10'}`}>
                  <img src={imageUrl} alt={f.label} className="w-full h-full object-cover" style={{ filter: f.css }} />
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-wide ${activeFilter === f.id ? 'text-pink-400' : 'text-gray-500'}`}>{f.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* STICKERS TAB */}
        {tab === 'stickers' && (
          <div className="grid grid-cols-8 gap-2 overflow-y-auto no-scrollbar" style={{ maxHeight: '140px' }}>
            {STICKERS.map(emoji => (
              <motion.button key={emoji} whileTap={{ scale: 0.75 }} onClick={() => addSticker(emoji)}
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-2xl hover:bg-white/20 transition-colors">
                {emoji}
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* ── Export Button ── */}
      <div className="px-4 pb-4 pt-2 bg-black">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={exportPNG}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-black font-black text-sm tracking-wide shadow-xl shadow-green-900/40"
        >
          ⬇ Export Meme (PNG)
        </motion.button>
      </div>
    </motion.div>
  )
}
