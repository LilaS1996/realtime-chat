'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState('')

  const handleLogin = async () => {
    if (!email.trim()) return

    setSending(true)
    setMessage('')
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: 'http://localhost:3000/chat',
        },
      })

      if (error) {
        console.error(error)
        setMessage('發送登入連結失敗：' + error.message)
        return
      }

      setMessage('已寄出登入連結，請到信箱點擊連結。')
    } finally {
      setSending(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">登入聊天室</h1>
        <p className="text-gray-500 text-sm mb-6">
          請輸入 Email，我們會寄一封登入連結給你。
        </p>
        <input
          type="email"
          placeholder="you@example.com"
          className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium disabled:opacity-50"
          onClick={handleLogin}
          disabled={sending}
        >
          {sending ? '發送中...' : '寄送登入連結'}
        </button>
        {message && (
          <p className="mt-4 text-sm text-gray-600">
            {message}
          </p>
        )}
      </div>
    </main>
  )
}
