import React, { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MemeEditor from './components/MemeEditor.jsx'

/*
  MF — Memes Finder Preview (Dark / Netflix-like theme)
  + Navigation, Modal, Bottom Sheet, Category Grid, Chat
  ------------------------------------------------------
  • Mobile-focused layout (390×844 / iPhone preview)
  • Home screen with hero, categories, audio clips, best edits
  • "See all" opens full templates page (wireframe grid)
  • Tapping a category opens a per-category grid page
  • Bottom Nav: Home / Categories / Chat / Saved / Profile
  • Chat tab shows message UI + message bar to ask admin
*/

const SLIDE_DURATION = 3200 // ms

const CATEGORIES = [
  { id: 'sunil', label: 'Sunil Templates', imgSrc: 'https://i.postimg.cc/YG2PHpMQ/Whats-App-Image-2025-12-07-at-09-56-54-2a90bedc.jpg' },
  { id: 'brahmi', label: 'Brahmi Templates', imgSrc: 'https://i.postimg.cc/Mnxb49Wk/Whats-App-Image-2025-12-07-at-09-56-52-4f67f9f0.jpg' },
  { id: 'ali', label: 'Ali Templates', imgSrc: 'https://i.postimg.cc/HrpX3j2T/Whats-App-Image-2025-12-07-at-09-56-52-d056fb73.jpg' },
  { id: 'mohanlal', label: 'Mohanlal Templates', imgSrc: 'https://i.postimg.cc/WFJktZNp/Whats-App-Image-2025-12-07-at-09-56-53-e33a55c6.jpg' },
  { id: 'vk', label: 'VK Templates', imgSrc: 'https://i.postimg.cc/HrZc2znR/Whats-App-Image-2025-12-07-at-09-56-53-eaf5d238.jpg' },
  { id: 'satya', label: 'Satya Templates', imgSrc: 'https://i.postimg.cc/rz1DbMzf/Whats-App-Image-2025-12-07-at-09-56-54-32f0e1b4.jpg' },
]

const AUDIO_CLIPS = [
  { id: 'audio1', label: 'Beat Pack 1' },
  { id: 'audio2', label: 'Funny BGMs' },
  { id: 'audio3', label: 'Mass Entry Drops' },
  { id: 'audio4', label: 'Romantic Loops' },
  { id: 'audio5', label: 'Dialog Cuts' },
  { id: 'audio6', label: 'Random Pack' },
]

function Logo() {
  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="relative">
        {/* Glow behind logo */}
        <motion.div
          className="absolute -inset-0.5 rounded-2xl bg-gradient-to-tr from-[#E50914] via-[#ff7849] to-[#fde68a] opacity-70 blur-md"
          animate={{ opacity: [0.35, 0.85, 0.35] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Logo image */}
        <motion.div
          className="relative w-11 h-11 rounded-2xl overflow-hidden bg-black border border-white/15 shadow-[0_12px_32px_rgba(0,0,0,0.9)]"
          whileHover={{ scale: 1.06, rotate: -2 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 320, damping: 18 }}
        >
          <img
            src="https://i.postimg.cc/34S0LZtv/Whats-App-Image-2025-12-01-at-21-15-19-8f747c93.jpg"
            alt="Memes Finder logo"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      <div className="flex flex-col leading-tight">
        {/* Main brand text */}
        <motion.div
          className="flex items-baseline gap-1"
          initial={{ x: -4, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <span className="text-[10px] font-semibold text-gray-400 tracking-[0.25em] uppercase">
            MF
          </span>
          <span className="text-[10px] font-medium text-gray-500 uppercase tracking-[0.18em]">
            • APP
          </span>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ scale: 0.96 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <motion.span
            className="text-[15px] font-extrabold bg-gradient-to-r from-[#ffffff] via-[#fee2e2] to-[#fed7aa] bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]"
            animate={{
              textShadow: [
                '0 0 8px rgba(255,255,255,0.25)',
                '0 0 16px rgba(229,9,20,0.4)',
                '0 0 8px rgba(255,255,255,0.25)',
              ],
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            MEMES FINDER
          </motion.span>

          {/* small underline accent */}
          <motion.div
            className="absolute -bottom-1 left-0 h-[2px] rounded-full bg-gradient-to-r from-[#E50914] via-[#fb923c] to-transparent"
            initial={{ width: 0 }}
            animate={{ width: '82%' }}
            transition={{ duration: 0.7, delay: 0.25, ease: 'easeOut' }}
          />
        </motion.div>

        <motion.span
          className="mt-1 text-[11px] text-gray-400"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          Templates • BGMs • Clips
        </motion.span>
      </div>
    </motion.div>
  )
}

function TopNavMobile({ user, onOpenLogin, onOpenSignup, onOpenUpload }) {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-gradient-to-b from-[#141414] to-[#0b0b0b] border-b border-transparent">
      <Logo />
      <div className="flex items-center gap-2">
        {!user && (
          <button 
            onClick={onOpenSignup} 
            className="px-3 py-2 rounded-md bg-transparent border border-gray-700 text-white text-xs font-semibold hover:bg-gray-800"
          >
            Sign Up
          </button>
        )}
        <button 
          onClick={onOpenLogin} 
          className="p-2 rounded-full border border-gray-700 text-gray-200 flex items-center justify-center min-w-[32px] h-[32px] overflow-hidden"
        >
          {user ? (
            <span className="text-xs font-bold text-[#E50914]">{user.username.charAt(0).toUpperCase()}</span>
          ) : (
            '👤'
          )}
        </button>
        <button aria-label="upload" onClick={onOpenUpload} className="p-2 rounded-md bg-[#E50914] text-white text-xs font-semibold">
          Upload
        </button>
      </div>
    </header>
  )
}

function SearchBarMobile({ onSearch }) {
  const [q, setQ] = useState('')
  const handleChange = (e) => { setQ(e.target.value); onSearch && onSearch(e.target.value) }
  return (
    <div className="px-4 pt-4">
      <div className="flex items-center gap-3 bg-[#121212] border border-gray-800 rounded-full px-3 py-2 shadow-sm">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M21 21l-4.35-4.35" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="11" cy="11" r="5" stroke="#9CA3AF" strokeWidth="1.5" />
        </svg>
        <input
          value={q}
          onChange={handleChange}
          aria-label="Search templates or BGMs"
          placeholder="Search memes, templates, BGMs..."
          className="flex-1 text-sm bg-transparent outline-none placeholder-gray-500 text-gray-200"
        />
        {q && <button onClick={() => { setQ(''); onSearch && onSearch(''); }} className="text-gray-400 text-xs">✕</button>}
        <button aria-label="voice" className="p-1 text-gray-300">🎤</button>
      </div>
    </div>
  )
}

function useAutoplay(count, duration = SLIDE_DURATION) {
  const [index, setIndex] = useState(0)
  // Automation removed by user request
  return [index, setIndex]
}

function MobileCarousel({ height = 160, slidesCount = 4 }) {
  const slides = new Array(slidesCount).fill(null)
  const [index, setIndex] = useAutoplay(slides.length, 3000)

  return (
    <div className="px-4 mt-4">
      <div className="relative w-full rounded-2xl overflow-hidden" style={{ height }}>
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.45 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#151515] to-[#0f0f0f]">
              {index === 0 ? (
                <img
                  src="https://i.postimg.cc/tC1YN2FC/Whats-App-Image-2025-11-25-at-14-37-13-adbd1118.jpg"
                  className="absolute inset-0 w-full h-full object-contain p-4"
                  alt="slide-1"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <motion.div
                    className="w-[88%] h-[78%] rounded-2xl bg-gradient-to-br from-[#1e293b] via-[#020617] to-black border border-white/10 shadow-[0_18px_45px_rgba(15,23,42,0.9)] flex items-center justify-between px-4"
                    initial={{ opacity: 0.7, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="inline-flex items-center text-[11px] font-medium text-cyan-300/90 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-400/30">
                        ✨ Smart suggestions
                      </span>
                      <p className="text-xs text-gray-200 mt-1">
                        Mobile slide placeholder — drop your best meme previews here.
                      </p>
                      <span className="text-[10px] text-gray-500 mt-1">
                        Auto-rotating • swipe to explore
                      </span>
                    </div>
                    <motion.div
                      className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#E50914] via-[#f97316] to-[#fde68a] flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(248,113,113,0.7)]"
                      animate={{ rotate: [0, 8, 0] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      🎬
                    </motion.div>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full ${i === index ? 'bg-[#E50914]' : 'bg-gray-600'}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function CategoriesMobile({ onSeeAll, onSelectCategory }) {
  return (
    <div className="px-4 mt-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-200">Categories</h2>
          <div className="mt-0.5">
            <motion.span
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="text-xs text-gray-400 inline-block"
            >
              Video clips
            </motion.span>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="h-[2px] mt-1 rounded-full bg-gradient-to-r from-[#E50914] via-[#ff7849] to-transparent"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={onSeeAll}
          className="text-xs text-gray-400 cursor-pointer hover:text-white transition"
        >
          See all
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-3 gap-4"
      >
        {CATEGORIES.map((cat) => (
          <motion.button
            key={cat.id}
            type="button"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 320, damping: 18 }}
            className="flex flex-col items-center gap-2 group"
            onClick={() => onSelectCategory(cat)}
          >
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-[#18181b] via-[#020617] to-black border border-white/10 flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.7)]">
              <img
                src={cat.imgSrc}
                alt={cat.label}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="text-[11px] text-gray-300 text-center leading-tight">{cat.label}</div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  )
}

function BestEditsMobile() {
  const slides = new Array(6).fill(null)
  const [index, setIndex] = useAutoplay(slides.length, 3600)

  return (
    <div className="px-4 mt-4">
      <div className="w-full h-44 rounded-xl overflow-hidden bg-gradient-to-br from-[#020617] via-[#111827] to-[#020617] shadow-[0_20px_60px_rgba(0,0,0,0.85)] border border-indigo-500/30 relative">
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex items-center justify-center p-3"
          >
            <div className="w-full h-full rounded-lg flex items-center justify-between px-4">
              <div className="flex flex-col gap-1">
                <span className="inline-flex items-center text-[11px] font-medium text-indigo-200 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-400/40">
                  🔥 Best edits lane
                </span>
                <p className="text-xs text-gray-100 mt-1">
                  Best Edit Placeholder — plug in your top reels or meme edits.
                </p>
                <span className="text-[10px] text-gray-400 mt-1">
                  Looped preview • tap to open
                </span>
              </div>
              <motion.div
                className="w-16 h-16 rounded-2xl border border-indigo-400/50 bg-black/40 flex items-center justify-center text-xl text-indigo-100 shadow-[0_0_32px_rgba(129,140,248,0.8)]"
                animate={{ scale: [1, 1.08, 1], rotate: [0, -4, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              >
                ⭐
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center">
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-2 h-2 rounded-full ${i === index ? 'bg-[#E50914]' : 'bg-gray-600'}`}
              />
            ))}
          </div>
          <div className="text-xs text-gray-400">Autoplay</div>
        </div>
      </div>
    </div>
  )
}

function SavedPage({ onBack }) {
  return (
    <div className="px-4 pt-4 pb-6 min-h-[700px]">
      <div className="flex items-center justify-between mb-4">
        <motion.button
          type="button"
          onClick={onBack}
          initial={{ x: -16, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          whileHover={{ scale: 1.15, x: -2 }}
          whileTap={{ scale: 0.9 }}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-[#E50914] via-[#f97316] to-[#fde68a] text-black shadow-[0_0_18px_rgba(248,113,113,0.7)]"
        >
          <span className="text-[28px] font-extrabold leading-none">←</span>
        </motion.button>
        <h2 className="text-sm font-semibold text-gray-100">Saved</h2>
        <div className="w-6" />
      </div>

      <p className="text-xs text-gray-400 mb-4">
        Everything you saved — templates, audios & pages
      </p>

      <div className="grid grid-cols-2 gap-4">
        <SavedCard icon="📁" title="Saved Templates" accent="[#22c55e]" />
        <SavedCard icon="🎵" title="Saved Audios" accent="[#38bdf8]" />
        <SavedCard icon="🔥" title="Trending Pages" accent="[#f472b6]" />
        <SavedCard icon="🏆" title="Score" accent="[#facc15]" />
      </div>
    </div>
  )
}

function SavedCard({ icon, title, accent }) {
  return (
    <motion.div
      role="button"
      whileTap={{ scale: 0.94 }}
      animate={{ opacity: [1, 0.25, 1] }}
      transition={{ duration: 0.25 }}
      className={`rounded-2xl p-4 h-32 bg-gradient-to-br from-[#0f172a] to-[#020617] border border-${accent}/40 shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex flex-col justify-center`}
    >
      <div className="text-2xl">{icon}</div>
      <div className="text-sm font-semibold text-gray-100 mt-2">{title}</div>
      <div className="text-xs text-gray-400 mt-1">Wireframe view</div>
    </motion.div>
  )
}

function ProfilePage({ user, onLogout }) {
  if (!user) {
    return (
      <div className="px-4 py-20 flex flex-col items-center text-center">
        <div className="text-4xl mb-4">👤</div>
        <h2 className="text-xl font-bold text-white mb-2">Not Signed In</h2>
        <p className="text-sm text-gray-400 mb-6">Sign in to save templates and chat with admin.</p>
      </div>
    )
  }

  return (
    <div className="px-4 pt-4 pb-6 min-h-[500px]">
      <h2 className="text-lg font-bold text-white mb-6">Your Profile</h2>
      <div className="bg-[#141414] border border-gray-800 rounded-2xl p-6 mb-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E50914] to-[#fde68a] flex items-center justify-center text-2xl font-bold text-white">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="text-lg font-bold text-white">{user.username}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">Member</div>
        </div>
      </div>
      
      <button 
        onClick={onLogout}
        className="w-full bg-gray-800 text-white font-semibold rounded-xl py-4 hover:bg-red-900/40 transition-colors border border-gray-700"
      >
        Log Out
      </button>
    </div>
  )
}

function DownloadsSheet({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-30 flex items-end bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 260 }}
            animate={{ y: 0 }}
            exit={{ y: 260 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="w-full max-w-[390px] mx-auto bg-[#141414] border-t border-gray-700 rounded-t-3xl p-4 pb-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-600" />
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-100">Saved & Downloads</h3>
              <button
                onClick={onClose}
                className="text-xs text-gray-400 hover:text-white"
                aria-label="Close downloads"
              >
                Close
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-4">Manage everything you saved in one place</p>

            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="rounded-xl p-3 bg-gradient-to-br from-[#1f2937] to-[#020617] border border-[#22c55e]/40 shadow-[0_10px_30px_rgba(34,197,94,0.25)]"
              >
                <div className="text-lg">📁</div>
                <div className="text-xs font-semibold text-gray-100 mt-1">Saved Templates</div>
                <div className="text-[10px] text-gray-400">Your favorite meme layouts</div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="rounded-xl p-3 bg-gradient-to-br from-[#0f172a] to-[#020617] border border-[#38bdf8]/40 shadow-[0_10px_30px_rgba(56,189,248,0.25)]"
              >
                <div className="text-lg">🎵</div>
                <div className="text-xs font-semibold text-gray-100 mt-1">Saved Audios</div>
                <div className="text-[10px] text-gray-400">BGMs & sound clips</div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="rounded-xl p-3 bg-gradient-to-br from-[#18181b] to-[#020617] border border-[#f472b6]/40 shadow-[0_10px_30px_rgba(244,114,182,0.25)]"
              >
                <div className="text-lg">🔥</div>
                <div className="text-xs font-semibold text-gray-100 mt-1">Trending Pages</div>
                <div className="text-[10px] text-gray-400">Top Insta creators</div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="rounded-xl p-3 bg-gradient-to-br from-[#111827] to-[#020617] border border-[#facc15]/40 shadow-[0_10px_30px_rgba(250,204,21,0.25)]"
              >
                <div className="text-lg">🏆</div>
                <div className="text-xs font-semibold text-gray-100 mt-1">Score</div>
                <div className="text-[10px] text-gray-400">Insta page rating</div>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function AudioGridPage({ audio, onBack }) {
  const [audiosList, setAudiosList] = useState([])

  useEffect(() => {
    fetch(`https://mf-memes-finder-backend.onrender.com/api/audio?packId=` + audio.id)
      .then(res => res.json())
      .then(data => setAudiosList(data))
      .catch(err => console.error(err))
  }, [audio])

  const slots = Array.from({ length: 12 })

  return (
    <div className="px-4 pt-4 pb-6">
      <div className="flex items-center justify-between mb-4">
        <motion.button
          type="button"
          onClick={onBack}
          initial={{ x: -16, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          whileHover={{ scale: 1.15, x: -2 }}
          whileTap={{ scale: 0.9 }}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-[#22d3ee] via-[#38bdf8] to-[#a5f3fc] text-black shadow-[0_0_18px_rgba(56,189,248,0.7)]"
        >
          <span className="text-[28px] font-extrabold leading-none">←</span>
        </motion.button>
        <div className="flex flex-col items-center gap-0.5">
          <h2 className="text-sm font-semibold text-gray-100 tracking-wide truncate max-w-[180px]">
            {audio?.label || 'Audio Pack'}
          </h2>
          <span className="text-[10px] text-gray-500 uppercase tracking-[0.18em]">Audio Clips</span>
        </div>
        <div className="w-8" />
      </div>

      {/* Tabs row for audio */}
      <div className="flex items-center gap-6 mb-4 text-[11px] font-semibold uppercase tracking-[0.22em]">
        <div className="relative pb-1 text-cyan-300">
          <span>All Audios</span>
          <div className="absolute left-0 right-0 -bottom-0.5 h-[2px] rounded-full bg-cyan-400" />
        </div>
        <div className="text-gray-500">Trending</div>
      </div>

      {/* Audio list wireframe (rows) */}
      <div className="mt-2 space-y-3">
        {slots.map((_, index) => {
          const track = audiosList[index];
          return (
          <motion.div
            key={index}
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="w-full rounded-xl bg-[#020617] border border-cyan-900/70 shadow-[0_14px_38px_rgba(8,47,73,0.85)] px-3 py-2.5 flex items-center gap-3"
          >
            {/* left icon square */}
            <div className="w-10 h-10 rounded-md bg-gradient-to-br from-[#0f172a] via-[#020617] to-black flex items-center justify-center text-gray-300 text-lg">
              ♫
            </div>

            {/* middle: title + duration */}
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-gray-100 truncate">
                {track ? track.title : `0${index + 1} - Audio Clip Name ..`}
              </div>
              <div className="text-[10px] text-cyan-300 mt-0.5">
                {track ? track.duration : `0${index}:${index === 0 ? '27' : '3' + index}`}
              </div>
            </div>

            {/* right download button */}
            <button
              type="button"
              className="ml-2 w-9 h-9 rounded-xl bg-[#06b6d4] flex items-center justify-center text-base font-bold text-black shadow-[0_10px_28px_rgba(6,182,212,0.8)]"
            >
              ⬇
            </button>
          </motion.div>
        )})}
      </div>
    </div>
  )
}

function ReelItem({ meme, containerHeight }) {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [likeCount, setLikeCount] = useState(meme.ups)
  const [showHeart, setShowHeart] = useState(false)
  const [commentCount] = useState(Math.floor(Math.random() * 500) + 10)
  const [editorOpen, setEditorOpen] = useState(false)
  const lastTap = useRef(0)

  const handleLike = () => {
    if (!liked) setLikeCount(c => c + 1)
    else setLikeCount(c => c - 1)
    setLiked(v => !v)
  }

  const handleDoubleTap = () => {
    const now = Date.now()
    if (now - lastTap.current < 300) {
      if (!liked) {
        setLiked(true)
        setLikeCount(c => c + 1)
      }
      setShowHeart(true)
      setTimeout(() => setShowHeart(false), 900)
    }
    lastTap.current = now
  }

  const fmtCount = (n) => n > 1000 ? (n / 1000).toFixed(1) + 'k' : n

  return (
    <div
      className="relative flex items-center justify-center bg-black flex-shrink-0"
      style={{ height: containerHeight, width: '100%' }}
      onClick={handleDoubleTap}
    >
      {/* Meme Image */}
      <img
        src={meme.url}
        alt={meme.title}
        className="w-full h-full object-contain select-none"
        draggable={false}
        loading="lazy"
      />

      {/* Double-tap heart burst */}
      <AnimatePresence>
        {showHeart && (
          <motion.div
            key="heart-burst"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute pointer-events-none text-6xl z-50 select-none"
          >❤️</motion.div>
        )}
      </AnimatePresence>

      {/* Bottom gradient overlay */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-10" />

      {/* Right action sidebar */}
      <div className="absolute right-3 z-20 flex flex-col items-center gap-5" style={{ bottom: '80px' }}>
        {/* Like */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={(e) => { e.stopPropagation(); handleLike(); }}
          className="flex flex-col items-center gap-1"
        >
          <motion.div
            animate={{ scale: liked ? [1, 1.4, 1] : 1 }}
            transition={{ duration: 0.3 }}
            className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shadow-xl"
          >
            {liked ? '❤️' : '🤍'}
          </motion.div>
          <span className="text-white text-[10px] font-bold drop-shadow-lg">{fmtCount(likeCount)}</span>
        </motion.button>

        {/* Comment */}
        <button className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shadow-xl">💬</div>
          <span className="text-white text-[10px] font-bold drop-shadow-lg">{fmtCount(commentCount)}</span>
        </button>

        {/* Remix / Create button */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={(e) => { e.stopPropagation(); setEditorOpen(true); }}
          className="flex flex-col items-center gap-1"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-600/40 to-purple-600/40 backdrop-blur-md border border-pink-500/40 flex items-center justify-center text-2xl shadow-xl">✏️</div>
          <span className="text-white text-[10px] font-bold drop-shadow-lg">Remix</span>
        </motion.button>

        {/* Save */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={(e) => { e.stopPropagation(); setSaved(v => !v); }}
          className="flex flex-col items-center gap-1"
        >
          <div className={`w-12 h-12 rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shadow-xl transition-colors ${saved ? 'bg-yellow-500/40' : 'bg-black/30'}`}>
            {saved ? '🔖' : '📌'}
          </div>
          <span className="text-white text-[10px] font-bold drop-shadow-lg">Save</span>
        </motion.button>

        {/* Share */}
        <button className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shadow-xl">↗️</div>
          <span className="text-white text-[10px] font-bold drop-shadow-lg">Share</span>
        </button>

        {/* Download */}
        <a
          href={meme.url}
          download
          target="_blank"
          rel="noreferrer"
          onClick={e => e.stopPropagation()}
          className="flex flex-col items-center gap-1"
        >
          <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shadow-xl">⬇️</div>
          <span className="text-white text-[10px] font-bold drop-shadow-lg">Save</span>
        </a>
      </div>

      {/* MemeEditor overlay */}
      <AnimatePresence>
        {editorOpen && (
          <MemeEditor imageUrl={meme.url} onClose={() => setEditorOpen(false)} />
        )}
      </AnimatePresence>

      {/* Bottom info bar */}
      <div className="absolute left-3 z-20 flex flex-col gap-2" style={{ bottom: '80px', right: '72px' }}>
        {/* Author row */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-400 p-[2px] flex-shrink-0">
            <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-white font-black text-xs uppercase">
              {meme.author.substring(0, 2)}
            </div>
          </div>
          <span className="text-white font-bold text-sm drop-shadow-lg">@{meme.author}</span>
          <button className="px-3 py-0.5 rounded-full border border-white/40 bg-white/10 text-white text-[10px] font-bold backdrop-blur-sm hover:bg-white/20 transition-colors">
            Follow
          </button>
          {meme.ups > 5000 && (
            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white text-[9px] font-black tracking-wider">🔥 TRENDING</span>
          )}
        </div>
        {/* Title */}
        <p className="text-white text-xs drop-shadow-lg leading-snug line-clamp-2">{meme.title}</p>
        {/* Audio ticker */}
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-[8px]">🎵</div>
          <span className="text-white/80 text-[10px] drop-shadow-md">Original Sound · r/{meme.subreddit}</span>
        </div>
      </div>
    </div>
  )
}

function ReelsView({ memes, initialIndex, onClose }) {
  const containerRef = useRef(null)
  const [containerHeight, setContainerHeight] = useState(window.innerHeight)
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  useEffect(() => {
    const updateHeight = () => setContainerHeight(window.innerHeight)
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  // Scroll to initial index on open
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerHeight * initialIndex
    }
  }, [initialIndex, containerHeight])

  // Track current index from scroll position
  const handleScroll = () => {
    if (containerRef.current) {
      const idx = Math.round(containerRef.current.scrollTop / containerHeight)
      setCurrentIndex(idx)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 28, stiffness: 220 }}
      className="fixed inset-0 z-[200] bg-black flex flex-col"
      style={{ height: '100dvh' }}
    >
      {/* Top HUD */}
      <div className="absolute top-0 left-0 right-0 z-30 px-4 pt-3 pb-6 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
        <button
          onClick={onClose}
          className="pointer-events-auto text-white text-2xl font-black drop-shadow-xl w-10 h-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm border border-white/10"
        >←</button>
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-white font-bold tracking-widest text-sm drop-shadow-md">Reels</span>
          <span className="text-white/50 text-[10px]">{currentIndex + 1} / {memes.length}</span>
        </div>
        <div className="w-10" />
      </div>

      {/* Scrollable reel container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-scroll no-scrollbar"
        style={{
          height: containerHeight,
          scrollSnapType: 'y mandatory',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {memes.map((meme, idx) => (
          <div
            key={idx}
            style={{
              height: containerHeight,
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always',
            }}
          >
            <ReelItem meme={meme} containerHeight={containerHeight} />
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function CategoryGridPage({ category, onBack }) {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeReelIndex, setActiveReelIndex] = useState(null)

  useEffect(() => {
    setLoading(true)
    // Fetch 50 memes from public API to replace broken backend
    fetch(`https://meme-api.com/gimme/50`)
      .then(res => res.json())
      .then(data => {
        setTemplates(data.memes || [])
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [category])

  return (
    <>
      <div className="px-4 pt-4 pb-24 h-full overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between mb-4">
          <motion.button
            type="button"
            onClick={onBack}
            initial={{ x: -16, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            whileHover={{ scale: 1.15, x: -2 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-[#E50914] via-[#f97316] to-[#fde68a] text-black shadow-[0_0_18px_rgba(248,113,113,0.7)]"
          >
            <span className="text-[28px] font-extrabold leading-none">←</span>
          </motion.button>
          <div className="flex flex-col items-center gap-0.5">
            <h2 className="text-sm font-semibold text-gray-100 tracking-wide truncate max-w-[180px]">
              {category?.label || 'Trending Memes'}
            </h2>
            <span className="text-[10px] text-gray-500 uppercase tracking-[0.18em]">Template Clips</span>
          </div>
          <div className="w-8" />
        </div>

        {/* Tabs row similar to MOVIES / SERIES */}
        <div className="flex items-center gap-6 mb-4 text-[11px] font-semibold uppercase tracking-[0.22em]">
          <div className="relative pb-1 text-teal-300">
            <span>All Clips</span>
            <div className="absolute left-0 right-0 -bottom-0.5 h-[2px] rounded-full bg-teal-400" />
          </div>
          <div className="text-gray-500">Trending</div>
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-3 gap-3">
          {loading ? (
             Array.from({ length: 15 }).map((_, index) => (
              <div key={index} className="w-full h-32 rounded-xl bg-gray-800 animate-pulse shadow-[0_18px_38px_rgba(0,0,0,0.85)]" />
             ))
          ) : (
             templates.map((tmpl, index) => (
              <motion.button
                key={index}
                type="button"
                onClick={() => setActiveReelIndex(index)}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="flex flex-col gap-1 text-left relative group"
              >
                <div className="w-full h-32 rounded-xl bg-gradient-to-b from-[#1f2937] to-[#020617] border border-gray-700/70 shadow-[0_18px_38px_rgba(0,0,0,0.85)] overflow-hidden flex items-center justify-center relative">
                  <img src={tmpl.url} alt={tmpl.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="text-[10px] text-gray-300 font-medium truncate w-full">{tmpl.title}</div>
                <div className="text-[9px] text-gray-500 truncate w-full flex items-center gap-1">
                  <span>❤️ {tmpl.ups > 1000 ? (tmpl.ups/1000).toFixed(1)+'k' : tmpl.ups}</span>
                </div>
              </motion.button>
             ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {activeReelIndex !== null && (
          <ReelsView 
            memes={templates}
            initialIndex={activeReelIndex}
            onClose={() => setActiveReelIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

function ChatScreen({ user, onRequireLogin }) {
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')

  useEffect(() => {
    fetch(`https://mf-memes-finder-backend.onrender.com/api/chat`)
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.error(err))
  }, [])

  const handleSend = async () => {
    if (!inputText.trim()) return;
    if (!user) {
      onRequireLogin();
      return;
    }
    const newMsg = { from: 'user', text: inputText, userId: user.id }
    setMessages(prev => [...prev, { _id: Date.now().toString(), ...newMsg }])
    setInputText('')
    
    try {
      await fetch(`https://mf-memes-finder-backend.onrender.com/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMsg)
      })
    } catch(err) {
      console.error(err)
    }
  }

  return (
    <div className="px-4 pt-4 pb-4 flex flex-col min-h-[520px]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-sm font-semibold text-gray-100">Chat with admin</h2>
          <span className="text-[11px] text-gray-500">Ask for new templates, BGMs or clips</span>
        </div>
        <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-400/40">
          Online
        </span>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 pb-2">
        {messages.map((msg) => (
          <div
            key={msg._id || msg.id}
            className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-3 py-2 text-[12px] leading-snug shadow-[0_8px_26px_rgba(0,0,0,0.65)] border ${
                msg.from === 'user'
                  ? 'bg-gradient-to-br from-[#E50914] via-[#f97316] to-[#fb923c] text-white border-transparent'
                  : 'bg-[#111827] text-gray-100 border-gray-700'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Message bar */}
      <div className="mt-3 rounded-2xl bg-[#050816] border border-gray-800 px-3 py-2 flex items-center gap-2 shadow-[0_12px_30px_rgba(0,0,0,0.85)]">
        <button
          type="button"
          className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1e293b] to-[#020617] flex items-center justify-center text-[13px] text-cyan-300 border border-cyan-400/40"
        >
          +
        </button>
        <input
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-transparent outline-none text-[12px] text-gray-100 placeholder-gray-500"
          placeholder="Ask admin: e.g. ‘Need Brahmi reaction template’"
        />
        <motion.button
          onClick={handleSend}
          whileHover={{ scale: 1.05, x: 1 }}
          whileTap={{ scale: 0.94 }}
          type="button"
          className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#E50914] via-[#f97316] to-[#fde68a] text-[11px] font-semibold text-black shadow-[0_10px_30px_rgba(248,113,113,0.7)]"
        >
          Send
        </motion.button>
      </div>
    </div>
  )
}

function FullCategoriesPage({ onBack, onSelectCategory }) {
  const placeholders = Array.from({ length: 12 })

  return (
    <div className="px-4 pt-4 pb-6">
      <div className="flex items-center justify-between mb-4">
        <motion.button
          type="button"
          onClick={onBack}
          initial={{ x: -16, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          whileHover={{ scale: 1.15, x: -2 }}
          whileTap={{ scale: 0.9 }}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-[#E50914] via-[#f97316] to-[#fde68a] text-black shadow-[0_0_18px_rgba(248,113,113,0.7)]"
        >
          <span className="text-[28px] font-extrabold leading-none">←</span>
        </motion.button>
        <h2 className="text-sm font-semibold text-gray-100 tracking-wide">All Templates</h2>
        <div className="w-8" />
      </div>

      {/* Top tabs like MOVIES / SERIES style (wireframe only) */}
      <div className="flex items-center gap-6 mb-4 text-[11px] font-semibold uppercase tracking-[0.2em]">
        <div className="relative pb-1 text-teal-300">
          <span>VIDEO</span>
          <div className="absolute left-0 right-0 -bottom-0.5 h-[2px] rounded-full bg-teal-400" />
        </div>
        <div className="text-gray-500">AUDIO</div>
      </div>

      {/* 3-column wireframe grid, empty slots */}
      <div className="grid grid-cols-3 gap-3">
        {placeholders.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSelectCategory && onSelectCategory(CATEGORIES[index % CATEGORIES.length])}
            className="flex flex-col gap-1"
          >
            <div className="w-full h-32 rounded-xl bg-gradient-to-b from-[#1f2933] to-[#111827] border border-gray-700/70 shadow-[0_18px_38px_rgba(0,0,0,0.85)] overflow-hidden flex items-center justify-center">
              <div className="w-10 h-10 rounded-full border border-gray-500/60 flex items-center justify-center text-xs text-gray-400">
                +
              </div>
            </div>
            <div className="text-[10px] text-gray-300 font-medium truncate">Empty Slot</div>
            <div className="text-[9px] text-gray-500 truncate">Tap to assign stakeholder</div>
          </button>
        ))}
      </div>
    </div>
  )
}

function BottomNav({ current, onChange }) {
  const items = [
    { id: 'home',       label: 'Home',     icon: '🏠' },
    { id: 'explore',    label: 'Explore',   icon: '🔥' },
    { id: 'categories', label: 'Templates', icon: '🎭' },
    { id: 'chat',       label: 'Chat',      icon: '💬' },
    { id: 'profile',    label: 'Profile',   icon: '👤' },
  ]
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[370px] bg-black/75 backdrop-blur-xl rounded-2xl shadow-[0_18px_45px_rgba(0,0,0,0.85)] px-2 py-1.5 flex justify-between items-center border border-white/10 z-20">
      {items.map((it) => {
        const isActive = current === it.id
        return (
          <button key={it.id} className="relative flex-1 flex items-center justify-center py-1" onClick={() => onChange(it.id)}>
            {isActive && (
              <motion.div layoutId="nav-pill"
                className="absolute inset-y-1 left-0.5 right-0.5 rounded-xl bg-gradient-to-r from-[#E50914]/30 via-[#f97316]/20 to-[#fde68a]/10"
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              />
            )}
            <div className="relative flex flex-col items-center gap-0.5">
              <span className={`text-base ${isActive ? 'text-white' : 'text-gray-500'}`}>{it.icon}</span>
              <span className={`text-[9px] font-semibold tracking-wide ${isActive ? 'text-white' : 'text-gray-600'}`}>{it.label}</span>
            </div>
          </button>
        )
      })}
    </nav>
  )
}

function StaticFooter() {
  return (
    <footer className="mt-8 pb-24 pt-8 px-4 border-t border-gray-800/60 bg-gradient-to-b from-transparent to-[#050505] text-center flex flex-col items-center gap-2">
      <Logo />
      <p className="text-[10px] text-gray-500 max-w-[280px] mt-2 leading-relaxed">
        Memes Finder App • Your ultimate destination for viral templates, audio clips, and trend-setting edits.
      </p>
      <p className="text-[9px] text-gray-700 mt-1">v1.0.8 - Gender Removed & Final Fix</p>
      <div className="flex gap-4 mt-3 text-[10px] font-medium text-gray-400">
        <button className="hover:text-white transition-colors">Privacy Policy</button>
        <button className="hover:text-white transition-colors">Terms</button>
        <button className="hover:text-white transition-colors">Contact</button>
      </div>
      <p className="text-[9px] text-gray-600 mt-4">
        &copy; {new Date().getFullYear()} Memes Finder App. All rights reserved.
      </p>
    </footer>
  )
}

// ─── LOCAL AUTH HELPERS (works fully client-side, no backend needed) ────────────
const AUTH_STORE_KEY = 'mf_users_db'
const SESSION_KEY = 'mf_session'

// Simple deterministic hash — good enough for client-side session matching
function simpleHash(str) {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = (h * 0x01000193) >>> 0
  }
  return h.toString(16)
}

function getUsersDB() {
  try { return JSON.parse(localStorage.getItem(AUTH_STORE_KEY) || '{}') }
  catch { return {} }
}

function saveUsersDB(db) {
  localStorage.setItem(AUTH_STORE_KEY, JSON.stringify(db))
}

function authRegister(username, password) {
  const db = getUsersDB()
  const key = username.toLowerCase().trim()
  if (!key || key.length < 3) return { ok: false, message: 'Username must be at least 3 characters.' }
  if (password.length < 4) return { ok: false, message: 'Password must be at least 4 characters.' }
  if (db[key]) return { ok: false, message: 'Username already taken. Try a different one.' }
  const user = { id: `u_${Date.now()}`, username: key, displayName: username.trim(), createdAt: Date.now() }
  db[key] = { ...user, pwHash: simpleHash(password) }
  saveUsersDB(db)
  const session = { ...user, token: simpleHash(user.id + Date.now()) }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return { ok: true, user: session }
}

function authLogin(username, password) {
  const db = getUsersDB()
  const key = username.toLowerCase().trim()
  const record = db[key]
  if (!record) return { ok: false, message: 'Account not found. Please sign up first.' }
  if (record.pwHash !== simpleHash(password)) return { ok: false, message: 'Wrong password. Please try again.' }
  const { pwHash, ...user } = record
  const session = { ...user, token: simpleHash(user.id + Date.now()) }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return { ok: true, user: session }
}

function authLogout() {
  localStorage.removeItem(SESSION_KEY)
}

function getPersistedSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null') }
  catch { return null }
}
// ────────────────────────────────────────────────────────────────────────────────

function LoginModal({ isOpen, onClose, onLogin, initialIsRegister = false }) {
  const [isRegister, setIsRegister] = useState(initialIsRegister)
  const [username, setUsername]     = useState('')
  const [password, setPassword]     = useState('')
  const [showPw,   setShowPw]       = useState(false)
  const [isLoading, setIsLoading]   = useState(false)
  const [error,    setError]        = useState('')
  const [success,  setSuccess]      = useState('')

  useEffect(() => {
    setIsRegister(initialIsRegister)
    setError('')
    setSuccess('')
    setUsername('')
    setPassword('')
  }, [initialIsRegister, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    // Tiny delay for UX feel
    await new Promise(r => setTimeout(r, 600))

    const result = isRegister
      ? authRegister(username.trim(), password)
      : authLogin(username.trim(), password)

    setIsLoading(false)

    if (!result.ok) {
      setError(result.message)
      return
    }

    setSuccess(isRegister ? '🎉 Account created! Welcome!' : '👋 Welcome back!')
    onLogin(result.user)
    setTimeout(() => { onClose() }, 900)
  }

  const switchMode = () => {
    setIsRegister(v => !v)
    setError('')
    setSuccess('')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="login-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[500] flex items-center justify-center bg-black/75 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            key="login-card"
            initial={{ opacity: 0, scale: 0.88, y: 30 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.88, y: 30  }}
            transition={{ type: 'spring', damping: 22, stiffness: 240 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-[340px] relative overflow-hidden"
          >
            {/* Glass card */}
            <div className="bg-[#141414]/95 border border-white/10 rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.9)] backdrop-blur-xl">

              {/* Top gradient bar */}
              <div className="h-1 rounded-t-3xl bg-gradient-to-r from-[#E50914] via-pink-500 to-orange-400" />

              <div className="p-7">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-black text-white tracking-tight">
                      {isRegister ? '✨ Create Account' : '👋 Welcome Back'}
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {isRegister ? 'Join MF Memes Finder today' : 'Sign in to your account'}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/15 transition-colors text-sm"
                  >✕</button>
                </div>

                {/* Error / Success banners */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{   opacity: 0, height: 0 }}
                      className="mb-4 px-4 py-3 rounded-xl bg-red-950/60 border border-red-700/50 text-red-300 text-xs font-medium flex items-center gap-2"
                    >
                      <span className="text-base">⚠️</span>{error}
                    </motion.div>
                  )}
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mb-4 px-4 py-3 rounded-xl bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 text-xs font-medium flex items-center gap-2"
                    >
                      {success}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  {/* Username */}
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">👤</span>
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={e => { setUsername(e.target.value); setError('') }}
                      required
                      autoComplete="username"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-[#E50914]/60 focus:bg-white/8 transition-all"
                    />
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔑</span>
                    <input
                      type={showPw ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={e => { setPassword(e.target.value); setError('') }}
                      required
                      autoComplete={isRegister ? 'new-password' : 'current-password'}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-10 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-[#E50914]/60 focus:bg-white/8 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(v => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors text-xs"
                    >{showPw ? '🙈' : '👁️'}</button>
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={isLoading || !!success}
                    whileTap={!isLoading ? { scale: 0.97 } : {}}
                    className="relative w-full overflow-hidden rounded-xl py-3.5 mt-1 font-black text-sm text-white tracking-wide shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(135deg, #E50914 0%, #f97316 60%, #fde68a 100%)' }}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="40" strokeDashoffset="20" strokeLinecap="round"/>
                        </svg>
                        {isRegister ? 'Creating account...' : 'Signing in...'}
                      </span>
                    ) : (
                      isRegister ? 'Create My Account 🚀' : 'Sign In Now →'
                    )}
                  </motion.button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-white/8" />
                  <span className="text-[10px] text-gray-600 uppercase tracking-widest">or</span>
                  <div className="flex-1 h-px bg-white/8" />
                </div>

                {/* Guest mode */}
                <button
                  onClick={() => {
                    const guest = { id: 'guest', username: 'guest', displayName: 'Guest', token: 'guest-token' }
                    localStorage.setItem(SESSION_KEY, JSON.stringify(guest))
                    onLogin(guest)
                    onClose()
                  }}
                  className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-sm font-semibold hover:bg-white/10 hover:text-white transition-all"
                >
                  Continue as Guest 👻
                </button>

                {/* Switch mode */}
                <p className="text-xs text-gray-600 text-center mt-5">
                  {isRegister ? 'Already have an account? ' : "Don't have an account? "}
                  <button type="button" onClick={switchMode} className="text-[#E50914] font-bold hover:underline">
                    {isRegister ? 'Sign In' : 'Sign Up Free'}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Explore / Trending Page ───────────────────────────────────────────────────
function ExplorePage() {
  const [memes, setMemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeReelIdx, setActiveReelIdx] = useState(null)
  const [filter, setFilter] = useState('hot')
  const SUBS = { hot: 'memes', new: 'me_irl', top: 'dankmemes', trending: 'funny' }

  useEffect(() => {
    setLoading(true)
    setMemes([])
    fetch(`https://meme-api.com/gimme/${SUBS[filter]}/40`)
      .then(r => r.json())
      .then(d => { setMemes(d.memes || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [filter])

  return (
    <>
      <div className="px-4 pt-4 pb-28 overflow-y-auto no-scrollbar">
        <h2 className="text-base font-black text-white mb-3 tracking-wide">🔥 Explore Trending</h2>

        {/* Filter chips */}
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
          {Object.keys(SUBS).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest flex-shrink-0 border transition-all ${
                filter === f
                  ? 'bg-gradient-to-r from-pink-600 to-orange-500 text-white border-transparent shadow-lg shadow-pink-900/40'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20'
              }`}>
              {f === 'hot' ? '🔥 Hot' : f === 'new' ? '✨ New' : f === 'top' ? '🏆 Top' : '📈 Trending'}
            </button>
          ))}
        </div>

        {/* Masonry-style 2-column grid */}
        <div className="columns-2 gap-3 space-y-0">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="w-full mb-3 rounded-xl bg-gray-800 animate-pulse" style={{ height: i % 3 === 0 ? 180 : 130 }} />
              ))
            : memes.map((meme, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveReelIdx(i)}
                  className="w-full mb-3 rounded-xl overflow-hidden relative group block text-left"
                >
                  <img src={meme.url} alt={meme.title}
                    className="w-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent rounded-b-xl">
                    <p className="text-white text-[9px] font-semibold line-clamp-2 leading-tight">{meme.title}</p>
                    <span className="text-pink-400 text-[8px] font-bold">❤️ {meme.ups > 1000 ? (meme.ups/1000).toFixed(1)+'k' : meme.ups}</span>
                  </div>
                  {meme.ups > 10000 && (
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white text-[8px] font-black">🔥 HOT</span>
                  )}
                </motion.button>
              ))
          }
        </div>
      </div>

      <AnimatePresence>
        {activeReelIdx !== null && (
          <ReelsView memes={memes} initialIndex={activeReelIdx} onClose={() => setActiveReelIdx(null)} />
        )}
      </AnimatePresence>
    </>
  )
}
// ───────────────────────────────────────────────────────────────────────────────

export default function DemoMobile() {
  const [screen, setScreen] = useState('home')
  const [activeGridCategory, setActiveGridCategory] = useState(null)
  const [activeAudioClip, setActiveAudioClip] = useState(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [loginModalMode, setLoginModalMode] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const session = getPersistedSession()
    if (session) setUser(session)
  }, [])

  // Initialize with dummy data arrays if needed, but we keep the global ones for now
  
  const handleSelectCategory = (cat) => {
    setActiveGridCategory(cat)
    setScreen('categoryGrid')
  }

  const handleSelectAudio = (clip) => {
    setActiveAudioClip(clip)
    setScreen('audioGrid')
  }

  const showSearchBar =
    screen === 'home' || screen === 'explore' || screen === 'categories' || screen === 'categoryGrid' || screen === 'audioGrid'

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0b0b] via-[#ff4500]/40 to-[#141414] flex items-start justify-center py-6 relative overflow-hidden">
      {/* Soft central orange radial glow */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '34%',
          width: 820,
          height: 820,
          transform: 'translateX(-50%)',
          background:
            'radial-gradient(circle, rgba(255,99,44,0.6) 0%, rgba(255,99,44,0.28) 20%, rgba(255,99,44,0.12) 40%, rgba(0,0,0,0) 60%)',
          filter: 'blur(110px)',
          pointerEvents: 'none',
        }}
      />

      {/* Subtle moving purple accent */}
      <div
        style={{
          position: 'absolute',
          left: '-10%',
          top: '8%',
          width: 600,
          height: 600,
          background:
            'radial-gradient(circle at 30% 30%, rgba(124,58,237,0.45), rgba(124,58,237,0.18) 30%, rgba(0,0,0,0) 60%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
          animation: 'moveGlow 16s ease-in-out infinite',
        }}
      />

      <div
        className="w-[390px] bg-[#0b0b0b] rounded-2xl overflow-hidden shadow-xl border border-gray-900 relative z-10"
        style={{ backdropFilter: 'saturate(120%) blur(6px)' }}
      >
        <div className="bg-transparent">
          <TopNavMobile 
            user={user} 
            onOpenLogin={() => { setLoginModalMode(false); setIsLoginModalOpen(true); }} 
            onOpenSignup={() => { setLoginModalMode(true); setIsLoginModalOpen(true); }}
            onOpenUpload={() => setIsUploadModalOpen(true)} 
          />
          {showSearchBar && <SearchBarMobile onSearch={setSearchQuery} />}

          {screen === 'home' && (
            <>
              <MobileCarousel />
              <CategoriesMobile
                onSeeAll={() => setScreen('categories')}
                onSelectCategory={handleSelectCategory}
              />

              {/* Audio Clips heading */}
              <div className="px-4 mt-5">
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <h3 className="text-sm font-semibold text-gray-200">Audio Clips</h3>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '40%' }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="h-[2px] mt-1 rounded-full bg-gradient-to-r from-[#22d3ee] via-[#67e8f9] to-transparent"
                  />
                </motion.div>
              </div>

              {/* Audio Clips icons */}
              <div className="px-4 mt-3">
                <div className="grid grid-cols-3 gap-4">
                  {AUDIO_CLIPS.map((clip) => (
                    <button
                      key={clip.id}
                      type="button"
                      onClick={() => handleSelectAudio(clip)}
                      className="flex flex-col items-center gap-2 group"
                    >
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#020617] to-black border border-white/10 flex items-center justify-center shadow-[0_8px_24px_rgba(34,211,238,0.4)]">
                        <span className="text-xs text-cyan-200">▶</span>
                      </div>
                      <div className="text-[11px] text-gray-300 text-center">{clip.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <BestEditsMobile />
            </>
          )}

          {screen === 'categories' && (
            <FullCategoriesPage
              onBack={() => setScreen('home')}
              onSelectCategory={handleSelectCategory}
            />
          )}

          {screen === 'categoryGrid' && activeGridCategory && (
            <CategoryGridPage
              category={activeGridCategory}
              onBack={() => setScreen('home')}
            />
          )}

          {screen === 'audioGrid' && activeAudioClip && (
            <AudioGridPage
              audio={activeAudioClip}
              onBack={() => setScreen('home')}
            />
          )}

          {screen === 'explore' && <ExplorePage />}

          {screen === 'chat' && <ChatScreen user={user} onRequireLogin={() => setIsLoginModalOpen(true)} />}

          {screen === 'saved' && (
            <SavedPage onBack={() => setScreen('home')} />
          )}

          {screen === 'profile' && (
            <ProfilePage 
              user={user} 
              onLogout={() => {
                authLogout()
                setUser(null)
                setScreen('home')
              }} 
            />
          )}
          
          <StaticFooter />
        </div>
      </div>

      <BottomNav
        current={screen === 'categoryGrid' ? 'categories' : screen === 'audioGrid' ? 'home' : screen}
        onChange={setScreen}
      />

      <DownloadsSheet open={isSheetOpen} onClose={() => setIsSheetOpen(false)} />
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLogin={setUser} 
        initialIsRegister={loginModalMode}
      />
      <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
    </div>
  )
}

function UploadModal({ isOpen, onClose }) {
  const [title, setTitle] = useState('')
  const [categoryId, setCategoryId] = useState('sunil')
  const [imgSrc, setImgSrc] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`https://mf-memes-finder-backend.onrender.com/api/templates/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, categoryId, imgSrc })
      })
      if (res.ok) {
        alert('Template uploaded successfully via URL!')
        onClose()
        setTitle('')
        setImgSrc('')
      } else {
        const data = await res.json()
        alert(data.message || 'Error uploading')
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[320px] bg-[#141414] border border-gray-800 rounded-2xl p-6 shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
        <h2 className="text-xl font-bold text-white mb-6 text-center">Add Template</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="text" placeholder="Template Title" value={title} onChange={e => setTitle(e.target.value)} required
            className="w-full bg-[#222] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#E50914]"
          />
          <select 
            value={categoryId} onChange={e => setCategoryId(e.target.value)}
            className="w-full bg-[#222] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#E50914] appearance-none"
          >
            <option value="sunil">Sunil</option>
            <option value="brahmi">Brahmi</option>
            <option value="ali">Ali</option>
            <option value="mohanlal">Mohanlal</option>
            <option value="vk">VK</option>
            <option value="satya">Satya</option>
          </select>
          <input 
            type="url" placeholder="Image URL (e.g. https://...)" value={imgSrc} onChange={e => setImgSrc(e.target.value)} required
            className="w-full bg-[#222] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#E50914]"
          />
          {imgSrc && (
            <div className="w-full h-24 rounded-lg overflow-hidden border border-gray-700">
              <img src={imgSrc} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}
          <button type="submit" className="w-full bg-[#E50914] text-white font-semibold rounded-xl py-3 mt-2 hover:bg-[#f97316] transition-colors">
            Upload Template
          </button>
        </form>
      </motion.div>
    </div>
  )
}
