---
date: 2024-04-10 13:40:22
url: 
tags: 
  - node
  - nuxt3
  - redis
title: 基于Nuxt3实现一个短链系统
---



# 基于Nuxt3实现一个短链系统

> 线上访问地址
>
> https://m.yijun.fun/short

## 前言

在生活中我们经常遇到需要短链服务的场景

- 长链接的分享
  - ![image-20240605163505772](https://cdn.zytsxt.com//blogimage-20240605163505772.png)
- 短信的推送的链接
  - ![img](https://img.moreqifu.com/uploads/20231120/202311201731158471.jpg)
- ...

所以我们需要一个短链服务

但是市面上的短链要么需要收费 要么就是有广告或者验证码之类的

于是 我们自己写一个

## 架构图

> 技术栈
>
> 前端 nuxt3、typescript、esint、unocss、elementui-plus
>
> 后端 nuxt3-server redis
>
> 服务器 vercel

```js
                                  +-------------------------+
                                  |        Vercel           |
                                  |    (Deployment Server)  |
                                  +-----------+-------------+
                                              |
                            +-----------------+----------------+
                            |                                  |
                +-----------v-----------+           +----------v----------+
                |       Frontend        |           |       Backend       |
                |         (Nuxt3)       |           |     (Nuxt3 Server)  |
                +-----------+-----------+           +----------+----------+
                            |                                  |
                            |                                  |
          +-----------------v----------------+      +----------v----------+
          |          TypeScript              |      |         Redis        |
          |          ESLint                  |      |      (Cache DB)      |
          |          UnoCSS                  |      |                      |
          |          Element Plus            |      +----------------------+
          +----------------------------------+
```

除了域名之外 其他的应该都可以**白嫖**

redis 白嫖地址 [Try Redis Cloud with a Free Account - Redis](https://redis.io/try-free/)

## 开始

### 项目搭建

#### 

1. https://nuxt.com.cn/docs/getting-started/installation)

   - ```shell
     pnpm dlx nuxi@latest init short-url
     pnpm install
     ```

     

2. 安装我们所需要的库

   - ```json
      "dependencies": {
         "nuxt": "^3.11.2",
         "qrcode": "^1.5.3",
         "vue": "^3.4.27",
         "vue-router": "^4.3.2"
       },
       "devDependencies": {
         "@antfu/eslint-config": "^2.19.2",
         "@element-plus/nuxt": "^1.0.9",
         "@types/qrcode": "^1.5.5",  //二维码生成
         "@unocss/nuxt": "^0.60.4",
         "crypto": "^1.0.1",  //生成唯一的key
         "element-plus": "^2.7.4",
         "eslint": "^9.4.0",
         "sass": "^1.77.4"
       }
     ```

### 注册免费redis并且在nuxt3中引入

> 官网地址 [Redis Cloud Console (redislabs.com)](https://app.redislabs.com/#/)

![image-20240606091215788](https://cdn.zytsxt.com//blogimage-20240606091215788.png)

我这里使用Google注册

![image-20240606091400903](C:\Users\世纪云海\AppData\Roaming\Typora\typora-user-images\image-20240606091400903.png)



> 我们需要拿到
>
> - 端口号-port
> - 用户名-username
> - 密码-password
> - 连接地址-host

### 在nux3中引入

官方文档 [server/ · Nuxt 目录结构](https://nuxt.com.cn/docs/guide/directory-structure/server#服务器存储)

```ts
// 文件目录：nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    storage: {
      redis: {
        driver: 'redis',
        /* redis连接器选项 */
        port: 6379, // Redis端口
        host: '127.0.0.1', // Redis主机
        username: '', // 需要Redis >= 6
        password: '',
        db: 0, // 默认为0
        tls: {} // tls/ssl
      }
    }
  }
})
```

在nuxt3中 服务端使用的是nitro 所以我们这边移步nitro文档[KV Storage - Nitro (unjs.io)](https://nitro.unjs.io/guide/storage)

### 前端样式

#### 引入默认样式

```css
//文件目录：assets/style/default.css
body, h1, h2, h3, h4, h5, h6, hr, p, blockquote, dl, dt, dd, ul, ol, li, pre, form,fieldset, legend, button, input, textarea, th, td { margin:0; padding:0; }
body, button, input, select, textarea { font:12px/1.5tahoma, arial, \5b8b\4f53; }
h1, h2, h3, h4, h5, h6{ font-size:100%; }
address, cite, dfn, em, var { font-style:normal; }
code, kbd, pre, samp { font-family:couriernew, courier, monospace; }
small{ font-size:12px; }
ul, ol { list-style:none; }
a { text-decoration:none; }
a:hover { text-decoration:underline; }
sup { vertical-align:text-top; }
sub{ vertical-align:text-bottom; }
legend { color:#000; }
fieldset, img { border:0; }
button, input, select, textarea { font-size:100%; }
table { border-collapse:collapse; border-spacing:0; } 
```

在nuxt.config.ts中配置全局样式

```ts
// 文件目录：nuxt.config.ts
export default defineNuxtConfig({
  css: [
    '~/assets/styles/default.css'
  ],
  nitro: {
    storage: {
      redis: {
        driver: 'redis',
        /* redis连接器选项 */
        port: 6379, // Redis端口
        host: '127.0.0.1', // Redis主机
        username: '', // 需要Redis >= 6
        password: '',
        db: 0, // 默认为0
        tls: {} // tls/ssl
      }
    }
  }
})
```



#### 搭建首页

```vue
<!-- 文件目录：pages/index.vue -->
<script lang="ts" setup>
const url = ref('') // 输入框
const loading = ref(false) // 加载动画
// 生成短链接
const short_url = async () => {
  // 生成后续操作
}
</script>

<template>
  <div class="short_url min-h-screen flex items-center  flex-col">
    <div class="short_url_head flex flex-col items-center justify-center">
      <div class="logo flex justify-center text-3xl font-bold text-white">
        YiJun
      </div>
      <div class="text-white text-center">
        <h1 class="text-4xl font-bold">
          短链接生成
        </h1>
        <p class="text-xl mt-5">
          「不支持」自定义短链接😁
        </p>
      </div>
    </div>
    <div class="short_url_conent mt-100px">
      <div class="short_url_conent_input">
        <input v-model="url" type="text" class="w-full px-4" placeholder="请输入 http:// 或 https:// 开头的网址">
        <el-button :loading="loading" @click="short_url">
          生成短链
        </el-button>
      </div>
    </div>
    <shortDetail ref="shortDetailRef" />
  </div>
</template>

<style scoped lang="scss">
.short_url {
    position: relative;
    // 上下渐变
    background: linear-gradient(180deg, #262680 0%, #111121 50%, #111121 100%);

    .logo {
        background: url('~/assets/short/images/logo_bg.svg') no-repeat center center;
        background-size: 100%;
        width: 200px;
        height: 200px;
        align-items: center;
        // background-color: red;
        font-family: '钉钉进步体 Regular';
    }

    .short_url_conent_input {
        display: flex;
        background-color: #16162B;
        width: min(800px, 80vw);
        border-radius: 10px;
        height: 75px;
        align-items: center;
        border: 2px solid #3247E6;

        box-shadow: 0px 0px 20px rgba(50, 71, 230, 1);

        input {
            border: none;
            outline: none;
            background-color: #16162B;
            color: #fff;
            border-radius: 10px;

            &::placeholder {
                color: #eee;

            }

            @media screen and (max-width: 768px) {
                font-size: 12px;
            }
        }

        button {
            background-color: #3247E6;
            outline: none;
            height: 45px;
            margin: 0 20px;
            width: 150px;
            border: none;
            color: #fff;
            cursor: pointer;
            border-radius: 5px;
            font-weight: bold;
            transition: all .3s;
        }

        button:active {
            opacity: 0.9;
            transform: scale(0.7);
        }

        button:hover {
            transform: translateY(-3px)
        }
    }
}

@font-face {
    font-family: "钉钉进步体 Regular";
    font-weight: 400;
    src: url("//at.alicdn.com/wf/webfont/bKq9cgqVGbZ4/nmArWyJ4GD2C.woff2") format("woff2"),
        url("//at.alicdn.com/wf/webfont/bKq9cgqVGbZ4/nUSAiP6Odkzk.woff") format("woff");
    font-display: swap;
}
</style>
```

效果图

![image-20240606093754517](https://cdn.zytsxt.com//blogimage-20240606093754517.png)

编写子组件

```vue
<!-- 文件目录：components/short-detail/index.vue -->
<script lang="ts" setup>
import { ElMessage } from 'element-plus'

import QRCode from 'qrcode'

// 引入生成二维码插件qrcode
const qrCodeUrl = ref('')
const show = ref(false)
const shortUrl = ref('')
// 原始链接
const originalLink = ref('')

// 复制到剪切板
const copyToClipboard = (str: string) => {

  // 创建一个临时的 textarea 元素
  const textarea = document.createElement('textarea')
  textarea.value = str

  // 将 textarea 元素添加到 DOM 中
  document.body.appendChild(textarea)

  // 选中 textarea 的内容
  textarea.select()
  textarea.setSelectionRange(0, 99999) // 对于移动设备

  // 执行复制命令
  document.execCommand('copy')

  // 删除临时的 textarea 元素
  document.body.removeChild(textarea)

  ElMessage.success('复制成功')

}

const open = (parmas: {
  shortUrl: string
  originalLink: string
}) => {
  show.value = true
  shortUrl.value = parmas.shortUrl
  originalLink.value = parmas.originalLink
  const opt = {
    width: 100,
    height: 100,
    colorDark: '#000000',
    colorLight: '#ffffff',
  }

  QRCode.toDataURL(parmas.shortUrl, opt, (err, url) => {
    if (err)
      console.error(err)
    else
      qrCodeUrl.value = url

  })
}

defineExpose({
  open
})
</script>

<template>
  <div v-if="show" class="my-2 short-detail flex-col">
    <div class="short-detail-content flex items-center">
      <img :src="qrCodeUrl" alt="" srcset="" class="QRCode">
      <div class="info ml-4 flex flex-col ">
        <span class="text-white" @click="copyToClipboard(shortUrl)">短链接：<i class="link">{{ shortUrl }}</i></span>
        <div class=" text-gray-300 text-xs mt-2 ellipsis">
          原始链接：{{ originalLink }}
        </div>
      </div>
    </div>
    <span class="text-white ml-20px mt-20px">注意：此短链接有效期 <i class="link">30</i> 分钟，请合理规划使用</span>
  </div>
</template>

<style lang="scss" scoped>
.short-detail {
  background-color: #16162B;
  border: 2px solid #3247E6;
  border-radius: 10px;
  padding: 20px 0px;
  margin: 40px 0;
  width: min(800px, 80vw);
  display: flex;

  .QRCode {
    margin-left: 20px;
  }

  .link {
    color: #00A5DD;
    text-shadow: 0 0 1px #3464E0, 0 0 5px #3464E0, 0 0 0px #3464E0, 0 0 0px #3464E0;
    cursor: pointer;
  }
}
// 超过两行省略号
.ellipsis {
  overflow:hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
.info{
  width:calc(100% - 200px );
}
</style>
```

### 后端

> 思路
>
> 前言：由于我这个短链我想尽可能的方便 所以不加验证码 不需要登录这些 就要做好接口的防刷、（虽然服务器免费、redis免费）
>
> 1. 使用google recaptcha v3 降低被刷接口的风险  [reCAPTCHA v3  | Google for Developers](https://developers.google.com/recaptcha/docs/v3?hl=zh-cn)
> 2. 因为用户群体不大 可能就我一个人 所以短链设计来30分钟过期
> 3. 虽然做了人机验证 但是为了防止真人一直刷接口 所以添加一个id 每天最多添加50条记录
> 4. 短链要尽可能的保证每一个key的唯一性 所以我这边采用**crypto**库 使用**sha256** ，并且传入的原始链接和时间戳作为盐值

#### 准备工作

1. 统一响应的封装

   - ```typescript
     // 文件目录 utils/sendResponse.ts
     type StatusCodeType = 200 | 500 | 401 | 400 | 408 | 404 | 429;
     
     const statusMessages: { [key in StatusCodeType]: string } = {
         200: '请求成功',
         500: '服务器内部错误',
         401: '认证失败',
         400: '请求参数错误',
         408: '请求超时',
         404: '请求路径不存在',
         429: '请求过于频繁',
     };
     /**
      * @desc 封装返回数据
      * @param statusCode 状态码
      * @param data 返回数据
      */
     const sendResponse = (statusCode: StatusCodeType, data?: any): object => {
         const msg = statusMessages[statusCode] || '未知错误';
         return {
             data:data || null,
             code: statusCode,
             msg
         };
     };
     
     export default sendResponse
     ```

     

2. 公共方法的封装

   - ```typescript
     // 文件目录 utils/short.ts
     
     // 验证url的格式
     export const isValidUrl = (url: string) => {
         // 检查是否为字符串
         if (typeof url !== "string") {
             return "Invalid URL";
         }
         // 检查长度是否大于1000
         if (url.length > 1000) {
             return "URL is too long";
         }
         // 正则表达式验证链接
         const urlPattern = new RegExp(
             "^(https?:\\/\\/)?" + // protocol
             "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
             "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
             "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
             "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
             "(\\#[-a-z\\d_]*)?$",
             "i"
         ); // fragment locator
         const isValid = urlPattern.test(url);
     
         if (!isValid) {
             return "Invalid URL";
         }
         return true;
     };
     ```

     

   

3. 前端请求的统一封装

   - ```typescript
     //文件目录 service/index.ts
     // 引入了nuxt/app模块中的UseFetchOptions类型,UseFetchOptions类型是一个用于配置请求选项的接口或类型
     import type { UseFetchOptions } from "nuxt/app";
     
     //  HTTP 请求的方法
     type Methods = "GET" | "POST" | "DELETE" | "PUT";
     
     // URL 基地址
     const BASE_URL = "/api";
     
     // 请求结果数据格式
     export interface IResultData<T> {
         code: number;
         data: T;
         msg: string;
     }
     
     /**
      * api请求封装，使用useFetch函数
      * @param { String } url 请求地址
      * @param { String } method 请求方法
      * @param { Object } data 请求数据
      * @param { UseFetchOptions } options 请求选项
      */
     
     /**
      * options常用参数说明
      * @param { boolean } lazy    是否在加载路由后才请求该异步方法，默认为false
      * @param { boolean } server  是否在服务端请求数据，默认为true
      */
     class HttpRequest {
         request<T = any>(url: string, method: Methods, data: any, options?: UseFetchOptions<T>) {
             return new Promise((resolve, reject) => {
                 // 继承UseFetchOptions类型，包含了baseURL和method两个属性
                 const newOptions: UseFetchOptions<T> = {
                     baseURL: BASE_URL,
                     method,
                     ...options,
                 };
     
                 // 根据请求方法处理请求的数据
                 if (method === "GET" || method === "DELETE") {
                     // 将数据设置为newOptions的params属性
                     newOptions.params = data;
                 }
                 if (method === "POST" || method === "PUT") {
                     // 将数据设置为newOptions的body属性
                     newOptions.body = data;
                 }
     
                 // 发送请求
                 useFetch(url, newOptions)
                     .then((res) => {
                         // 处理响应数据
                         const resultData: IResultData<T> = res.data.value as IResultData<T>;
                         if (resultData.code !== 200) {
                             // 请求失败
                          return reject(resultData);
                         }
                         resolve(res.data.value);
                     })
                     .catch((error) => {
                         reject(error);
                     });
             });
         }
     
         // 封装常用方法
         get<T = any>(url: string, params?: any, options?: UseFetchOptions<T>) {
             return this.request(url, "GET", params, options);
         }
     
        
         post<T = any>(url: string, data: any, options?: UseFetchOptions<T>) {
             return this.request(url, "POST", data, options);
         }
     
        
         Put<T = any>(url: string, data: any, options?: UseFetchOptions<T>) {
             return this.request(url, "PUT", data, options);
         }
     
         
         Delete<T = any>(url: string, params: any, options?: UseFetchOptions<T>) {
             return this.request(url, "DELETE", params, options);
         }
     }
     
     const httpRequest = new HttpRequest();
     
     export default httpRequest;
     
     
     ```

   - ```typescript
     //文件目录 servece/api/short.ts
     /**
     * @description 短链服务
     * @created 2024-06-05 15:31:20
     */
     
     //文件目录：api/apiHttps.ts
     
     //引入
     import http from "~/service/index";
     
     
     
     
     /**
      * @description 创建短链
      * @param originalLink 原始链接
      * @param googleToken 谷歌验证码
      * @returns 短链
      */
     export const createShortUrl = (originalLink:string,googleToken:string) => {
         return http.post("/short/create", {
             originalLink:originalLink
         },{
             headers:{
                 "Authorization":"Bearer "+googleToken
             }
         })
     };
     
     ```

     

4. 前端 google recaptcha v3 的引入   [reCAPTCHA v3  | Google for Developers](https://developers.google.com/recaptcha/docs/v3?hl=zh-cn)

   ```typescript
   // 文件目录 nuxt.config.ts
   export default defineNuxtConfig({
     devtools: { enabled: true },
     modules: [
       '@element-plus/nuxt',
       "@unocss/nuxt"
     ],
     css: [
       '~/assets/styles/default.css'
     ],
     app:{
       head:{
         script:[
           {src:"https://www.google.com/recaptcha/api.js?render=你的客户端key",type:"text/javascript"}
         ]
       }
     },
     nitro: {
       storage: {
         "redis": {
           driver: "redis",
           port: "你的端口号",
           username: 'default',
           password: '你的密码',
           host: '填写你的redis连接地址',
         }
       },
     },
   })
   
   ```

#### 后端完整代码

```typescript
import crypto from "crypto";
import { isValidUrl } from "~/utils/short";
import sendResponse from '~/utils/sendResponse';
import { defineEventHandler, readBody } from 'h3';

interface GoogleAuthResponse {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  score: number;
}

// 生成随机的key
const generateRandomString = (originalLink: string): string => {
  const salt = `${originalLink}${Date.now()}`;  //当前时间戳和用户传入的原始链接作为盐值
  const hash = crypto.createHash("sha256").update(salt).digest("hex");
  return hash.slice(0, 5);
};

export default defineEventHandler(async (event) => {
  const { originalLink } = await readBody(event);  // 获取原始链接
  const token =event.node.req.headers.authorization?.replace("Bearer ", "");  // 获取token
  if (!token) {
    // 如果没有token，则返回401
    return sendResponse(401, null);
  }
  // 检查原始链接是否有效
  if (isValidUrl(originalLink)===true) {
    return sendResponse(400, null);
  }

  try {
    const response = await $fetch<GoogleAuthResponse>("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      body: new URLSearchParams({
        secret: "你的服务端key",
        response: token
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    if (response.success && response.score > 0.7) {
      const key = generateRandomString(originalLink);
      await useStorage("redis").setItem("short:" + key, originalLink, { ttl: 60 * 30 });
      return sendResponse(200, { shortUrl: "你的域名" + key });
    } else {
      return sendResponse(401, null);
    }
  } catch (error) {
    console.error(error);
    return sendResponse(500, null);
  }
});

```

> 在调试过程中 必须和google 控制台配置的域名一致 否则不能通过谷歌的验证

#### 前端完整代码

```vue
<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import shortDetail from '~/components/short-detail/index.vue'
import { isValidUrl } from '~/utils/short'
import { createShortUrl } from '~/service/api/short'

declare const grecaptcha: any

const url = ref('') // 输入框
const loading = ref(false) // 加载动画
const shortDetailRef = ref(shortDetail)
// 生成短链接
const short_url = async () => {
  const state = isValidUrl(url.value)
  if (state !== true)
    return ElMessage.error(state)

  loading.value = true
  grecaptcha.ready(async () => {
    grecaptcha.execute('你的key', { action: 'short_url' }).then(async (token: string) => {
      await createShortUrl(url.value, token).then((res: any) => {
        shortDetailRef.value.open({
          shortUrl: res.data.shortUrl,
          originalLink: url.value
        })
      }).finally(() => {
        loading.value = false
      }).catch((err) => {
        ElMessage.error(err.msg)
      })
    })

  })
}
</script>

<template>
  <div class="short_url min-h-screen flex items-center  flex-col">
    <div class="short_url_head flex flex-col items-center justify-center">
      <div class="logo flex justify-center text-3xl font-bold text-white">
        YiJun
      </div>
      <div class="text-white text-center">
        <h1 class="text-4xl font-bold">
          短链接生成
        </h1>
        <p class="text-xl mt-5">
          「不支持」自定义短链接😁
        </p>
      </div>
    </div>
    <div class="short_url_conent mt-100px">
      <div class="short_url_conent_input">
        <input v-model="url" type="text" class="w-full px-4" placeholder="请输入 http:// 或 https:// 开头的网址">
        <el-button :loading="loading" @click="short_url">
          生成短链
        </el-button>
      </div>
    </div>
    <shortDetail ref="shortDetailRef" />
  </div>
</template>

<style scoped lang="scss">
.short_url {
    position: relative;
    // 上下渐变
    background: linear-gradient(180deg, #262680 0%, #111121 50%, #111121 100%);

    .logo {
        background: url('~/assets/short/images/logo_bg.svg') no-repeat center center;
        background-size: 100%;
        width: 200px;
        height: 200px;
        align-items: center;
        // background-color: red;
        font-family: '钉钉进步体 Regular';
    }

    .short_url_conent_input {
        display: flex;
        background-color: #16162B;
        width: min(800px, 80vw);
        border-radius: 10px;
        height: 75px;
        align-items: center;
        border: 2px solid #3247E6;

        box-shadow: 0px 0px 20px rgba(50, 71, 230, 1);

        input {
            border: none;
            outline: none;
            background-color: #16162B;
            color: #fff;
            border-radius: 10px;

            &::placeholder {
                color: #eee;

            }

            @media screen and (max-width: 768px) {
                font-size: 12px;
            }
        }

        button {
            background-color: #3247E6;
            outline: none;
            height: 45px;
            margin: 0 20px;
            width: 150px;
            border: none;
            color: #fff;
            cursor: pointer;
            border-radius: 5px;
            font-weight: bold;
            transition: all .3s;
        }

        button:active {
            opacity: 0.9;
            transform: scale(0.7);
        }

        button:hover {
            transform: translateY(-3px)
        }
    }
}

@font-face {
    font-family: "钉钉进步体 Regular";
    font-weight: 400;
    src: url("//at.alicdn.com/wf/webfont/bKq9cgqVGbZ4/nmArWyJ4GD2C.woff2") format("woff2"),
        url("//at.alicdn.com/wf/webfont/bKq9cgqVGbZ4/nUSAiP6Odkzk.woff") format("woff");
    font-display: swap;
}
</style>
```

