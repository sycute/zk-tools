'use client'
import { useEffect,use,useState } from "react"
import { useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";




export default function UserPage({ params }) {
    const [rpInfo, setRpInfo] = useState();

     // 从 params 中获取动态路由参数
     const { id } = use(params)
     const client = useSuiClient();
    // 根据id获取红包数据
    useEffect(()=>{
        const getRpInfo=async()=>{
            const res = await client.getObject({id, options: {showContent: true}})
            console.log(res);
            

        }
        getRpInfo();
    })

    return (
      <div className='min-h-screen  mx-2 rounded-2xl relative pb-56 pt-24'>
        <div className="w-[400px] h-48 bg-slate-50 mx-auto mt-48  rounded-2xl shadow-lg">
            123
        </div>
      </div>
    );
  }
  