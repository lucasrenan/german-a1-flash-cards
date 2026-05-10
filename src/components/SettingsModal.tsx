import { useState } from 'react'
import type { Settings } from '../types'

interface Props {
  settings: Settings
  onSave: (settings: Settings) => void
  onClose: () => void
}

export function SettingsModal({ settings, onSave, onClose }: Props) {
  const [form, setForm] = useState<Settings>(settings)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave(form)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-800">Settings</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700">New cards per session</span>
            <input
              type="number"
              min={1}
              max={200}
              value={form.newCardsPerSession}
              onChange={(e) => setForm((f) => ({ ...f, newCardsPerSession: Number(e.target.value) }))}
              className="border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700">Max review cards per session</span>
            <input
              type="number"
              min={1}
              max={500}
              value={form.maxReviewsPerSession}
              onChange={(e) => setForm((f) => ({ ...f, maxReviewsPerSession: Number(e.target.value) }))}
              className="border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700">Audio playback speed</span>
            <select
              value={form.audioPlaybackRate}
              onChange={(e) => setForm((f) => ({ ...f, audioPlaybackRate: Number(e.target.value) }))}
              className="border border-slate-300 rounded-lg px-3 py-2 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value={0.5}>0.5× (very slow)</option>
              <option value={0.75}>0.75× (slow)</option>
              <option value={0.85}>0.85× (slightly slow)</option>
              <option value={1}>1× (normal)</option>
              <option value={1.25}>1.25× (fast)</option>
            </select>
          </label>

          <label className="flex items-center justify-between py-1">
            <span className="text-sm font-medium text-slate-700">Autoplay audio</span>
            <button
              type="button"
              role="switch"
              aria-checked={form.autoplayAudio}
              onClick={() => setForm((f) => ({ ...f, autoplayAudio: !f.autoplayAudio }))}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                form.autoplayAudio ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  form.autoplayAudio ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </label>

          <label className="flex items-center justify-between py-1">
            <span className="text-sm font-medium text-slate-700">Show examples by default</span>
            <button
              type="button"
              role="switch"
              aria-checked={form.showExamplesByDefault}
              onClick={() => setForm((f) => ({ ...f, showExamplesByDefault: !f.showExamplesByDefault }))}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                form.showExamplesByDefault ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  form.showExamplesByDefault ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </label>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  )
}
