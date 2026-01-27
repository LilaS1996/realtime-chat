'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: 'http://localhost:3000/chat'
      }
    })

    if (error) {
      setMessage('❌ 錯誤：' + error.message)
    } else {
      setMessage('✅ 登入 Email 已寄送！請檢查收件匣（垃圾郵件也要看）')
    }
    
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-8">
      <div className="max-w-md w-full bg-white/20 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/30">
        <h1 className="text-4xl font-bold text-white text-center mb-8 drop-shadow-lg">
          💬 即時聊天室
        </h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="輸入你的 Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 focus:outline-none focus:ring-2 focus:ring-white/80 text-lg placeholder-gray-500"
            required
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full p-4 bg-white text-blue-600 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ 寄送中...' : '🚀 立即登入'}
          </button>
        </form>
        
        {message && (
          <div className="mt-6 p-4 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
            <p className="text-white text-center font-medium">{message}</p>
          </div>
        )}
        
        <p className="text-white/80 text-center mt-6 text-sm">
          會寄送魔法連結到你的 Email，點擊即可進入聊天室！
        </p>
      </div>
    </main>
  )
}
