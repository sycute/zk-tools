'use client'

import { useState } from 'react'
import Link from "next/link";

export default function ReceiveRedEnvelope() {
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // 处理收取红包的逻辑
    console.log('收取红包', { password })
  }

  const handleReceiveNormal = () => {
    // 处理直接收取普通红包的逻辑
    console.log('直接收取普通红包')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">收取红包</h1>
      <div className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              口令
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="text"
              placeholder="请输入口令（如果有）"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              收取口令红包
            </button>
          </div>
        </form>
        <div className="mb-4">
          <button
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleReceiveNormal}
          >
            直接收取普通红包
          </button>
        </div>
        <div className="text-center">
          <Link href="/" className="inline-block align-baseline font-bold text-sm text-gray-600 hover:text-gray-800">
            返回主页
          </Link>
        </div>
      </div>
    </div>
  )
}

