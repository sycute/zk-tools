'use client'

import { useState } from 'react'
import Link from "next/link";

export default function SendRedEnvelope() {
  const [envelopeType, setEnvelopeType] = useState('normal')
  const [amount, setAmount] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // 处理发送红包的逻辑
    console.log('发送红包', { envelopeType, amount, password })
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">发送红包</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            红包类型
          </label>
          <div className="flex justify-between">
            <button
              type="button"
              className={`w-1/2 py-2 px-4 rounded-l ${envelopeType === 'normal' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setEnvelopeType('normal')}
            >
              普通红包
            </button>
            <button
              type="button"
              className={`w-1/2 py-2 px-4 rounded-r ${envelopeType === 'password' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setEnvelopeType('password')}
            >
              口令红包
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
            金额
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="amount"
            type="number"
            placeholder="请输入金额"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        {envelopeType === 'password' && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              口令
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="text"
              placeholder="请输入口令"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        )}
        <div className="flex items-center justify-between">
          <button
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            发送红包
          </button>
          <Link href="/" className="inline-block align-baseline font-bold text-sm text-gray-600 hover:text-gray-800">
            返回主页
          </Link>
        </div>
      </form>
    </div>
  )
}

/*
需要一个发送红包和接收红包的网站，发送和接收页面分离
发送页面需求：有两种红包，一种是普通红包，发送时需要输入总金额和红包数量，一种是口令红包，发送时需要输入总金额、红包数量和口令。在表单右下角设置切换按钮，点击切换红包类型。切换时使用动画效果过渡。
接收页面需求：接收红包页面会展示所有未接收的红包列表，列表以卡片的形式展示，每行5个。卡片需要展示红包总金额，剩余金额，发送人，红包类型（普通或口令），如果是已经被领取的红包，则卡片变成浅色。
点击卡片之后进入红包详情页，详情页展示红包的详细信息，并有领取按钮。如果是口令红包，则需要输入口令才能领取。
*/