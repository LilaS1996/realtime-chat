'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

type Message = {
  id: number
  content: string
  created_at: string
  room_id: string | null
  user_id: string | null
}

type User = {
  id: string
  email?: string
}

const ROOMS = [
  { id: 'general', label: '📢 General' },
  { id: 'tech', label: '💻 Tech' },
  { id: 'random', label: '🎮 Random' },
]

export default function ChatPage() {
  const [currentRoom, setCurrentRoom] = useState<string>('general')
  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  // 抓目前登入使用者
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error) {
        console.error('getUser error:', error)
        return
      }

      setUser(user as User | null)
    }

    getUser()
  }, [])

  // 載入訊息 + Realtime 訂閱（依房間切換）
  useEffect(() => {
    const loadMessagesAndSubscribe = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', currentRoom)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('load messages error:', error)
        return
      }

      setMessages(data || [])
    }

    loadMessagesAndSubscribe()

    const channel = supabase
      .channel('messages-room-' + currentRoom)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${currentRoom}`,
        },
        (payload) => {
          const newMessage = payload.new as Message
          setMessages((prev) => [...prev, newMessage])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentRoom])

  const handleSend = async () => {
    if (!message.trim()) return

    setSending(true)
    try {
      const text = message.trim()

      const { error } = await supabase.from('messages').insert({
        content: text,
        room_id: currentRoom,
        user_id: user ? user.id : null,
      })

      if (error) {
        console.error('insert error:', error)
        alert('送出失敗：' + error.message)
        return
      }

      setMessage('')
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    window.location.href = '/auth'
  }

  const currentRoomLabel =
    ROOMS.find((r) => r.id === currentRoom)?.label ?? '聊天室'

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto h-screen flex">
        {/* 左側：房間列表 + 使用者資訊 */}
        <div className="w-80 bg-white border-r border-gray-200 p-6 flex flex-col">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">聊天室</h2>

          <div className="space-y-2 mb-6">
            {ROOMS.map((room) => (
              <button
                key={room.id}
                className={
                  'w-full p-3 rounded-lg transition-all duration-200 font-medium ' +
                  (currentRoom === room.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200')
                }
                onClick={() => setCurrentRoom(room.id)}
              >
                {room.label}
              </button>
            ))}
          </div>

          <div className="mt-auto border-top pt-4 border-t">
            {user ? (
              <>
                <div className="text-sm text-gray-600 mb-2">
                  已登入：{user.email ?? user.id}
                </div>
                <button
                  className="w-full py-2 text-sm bg-gray-200 rounded-lg hover:bg-gray-300"
                  onClick={handleSignOut}
                >
                  登出
                </button>
              </>
            ) : (
              <button
                className="w-full py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                onClick={() => (window.location.href = '/auth')}
              >
                前往登入頁面
              </button>
            )}
          </div>
        </div>

        {/* 右側：聊天區域 */}
        <div className="flex-1 flex flex-col">
          {/* 標題列 */}
          <div className="bg-white border-b border-gray-200 p-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {currentRoomLabel}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {messages.length} 則訊息（Realtime）
              </p>
            </div>
          </div>

          {/* 訊息列表 */}
          <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-gray-50 to-white space-y-4">
            {messages.map((m) => {
              const isMe = user && m.user_id === user.id
              return (
                <div
                  key={m.id}
                  className={
                    'flex items-start space-x-3 ' +
                    (isMe ? 'justify-end' : '')
                  }
                >
                  {!isMe && (
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                      U
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-gray-900">
                      {isMe ? '你' : '其他使用者'}
                    </div>
                    <div className="text-sm text-gray-500 mb-1">
                      {new Date(m.created_at).toLocaleString()}
                    </div>
                    <div
                      className={
                        'p-3 rounded-lg border shadow-sm max-w-xs ' +
                        (isMe
                          ? 'bg-blue-500 text-white ml-auto'
                          : 'bg-white')
                      }
                    >
                      {m.content}
                    </div>
                  </div>
                  {isMe && (
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-medium">
                      Y
                    </div>
                  )}
                </div>
              )
            })}

            {messages.length === 0 && (
              <div className="text-gray-400 text-center mt-10">
                這個房間還沒有訊息，先發一則看看吧！
              </div>
            )}
          </div>

          {/* 輸入區 */}
          <div className="bg-white border-t border-gray-200 p-6">
            <div className="flex space-x-3">
              <input
                type="text"
                placeholder={
                  user ? '輸入訊息...' : '請先登入後再發訊息（左邊按登入）'
                }
                className="flex-1 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!user}
              />
              <button
                className="px-6 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 font-medium shadow-lg disabled:opacity-50"
                onClick={handleSend}
                disabled={sending || !user}
              >
                {sending ? '送出中...' : '傳送'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
