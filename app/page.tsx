'use client'

import { useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function HomePage() {
  useEffect(() => {
    const checkAndRedirect = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // 不管有沒有 user，都直接帶去 /chat
      // 如果沒有登入，/chat 左下角會顯示「前往登入頁面」
      window.location.href = '/chat'
    }

    checkAndRedirect()
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-500">正在前往聊天室...</p>
    </main>
  )
}
