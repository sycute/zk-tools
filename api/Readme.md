## api

### 1. 创建口令

公开：output = hash(hash(口令))
证明：知晓隐私数据 hash(口令)

```
struct {
   gift: Vec<T>,
   claimer: table<, >
}
```

### 2. 数据转换关系

proof -> seri -> hex

given_str -> hash_to_u64

public_input -> seri -> hex = expected

### 3. 部署

后端服务在 shuttle 上
创建样例 GET https://psw-gift-2xvg.shuttle.app/zkrpnew?e=sam

领取样例 GET https://psw-gift-2xvg.shuttle.app/zkrpclaim?g=sam&e=01000000000000000fbd1d3ac37b96e52be719a10ff37d53ccfb7f21313e3dd47f5b3915ca173809
