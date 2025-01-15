## api

### 1. 创建口令

公开：output = hash(hash(口令))
证明：知晓隐私数据 hash(口令)

### 3. 部署

后端服务部署在 shuttle

发送 GET https://psw-gift-2xvg.shuttle.app/zkrpnew?e=sam
这里的`sam`就是口令密码，返回字符串

领取 GET https://psw-gift-2xvg.shuttle.app/zkrpclaim?g=sam&e=01000000000000000fbd1d3ac37b96e52be719a10ff37d53ccfb7f21313e3dd47f5b3915ca173809
这里的`g`就是之前的口令密码，`e`是上个接口返回的字符串

Sui 测试网
共享对象 Record：0x80011863aba3e88fb5f975ef124bd3bf3340398625a9372b52d583d012bcac17
合约：0xd881a399b170c8a0af91053bd26824281b19d65f0cdbdc4dc6f23586a3f6fe8d
