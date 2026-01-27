export default function ChatPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto h-screen flex">
        {/* 左側：房間列表 */}
        <div className="w-80 bg-white border-r border-gray-200 p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">聊天室</h2>
          <div className="space-y-2">
            <button className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium">
              📢 General
            </button>
            <button className="w-full p-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-200 font-medium">
              💻 Tech
            </button>
            <button className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 font-medium">
              🎮 Random
            </button>
          </div>
        </div>

        {/* 右側：聊天區域 */}
        <div className="flex-1 flex flex-col">
          {/* 聊天室標題 */}
          <div className="bg-white border-b border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-800">📢 General</h1>
            <p className="text-gray-500 text-sm mt-1">5 位成員線上</p>
          </div>

          {/* 訊息列表 */}
          <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                A
              </div>
              <div>
                <div className="font-medium text-gray-900">Alice</div>
                <div className="text-sm text-gray-500 mb-1">2分鐘前</div>
                <div className="bg-white p-3 rounded-lg border shadow-sm max-w-xs">
                  大家好！歡迎來到即時聊天室！🎉
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3 mb-4 justify-end">
              <div>
                <div className="font-medium text-gray-900">你</div>
                <div className="text-sm text-gray-500 mb-1">1分鐘前</div>
                <div className="bg-blue-500 text-white p-3 rounded-lg shadow-sm max-w-xs ml-auto">
                  好興奮！終於做出聊天室了！
                </div>
              </div>
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-medium">
                Y
              </div>
            </div>
          </div>

          {/* 輸入區域 */}
          <div className="bg-white border-t border-gray-200 p-6">
            <div className="flex space-x-3">
              <input
                type="text"
                placeholder="輸入訊息..."
                className="flex-1 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-6 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 font-medium shadow-lg">
                傳送
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
