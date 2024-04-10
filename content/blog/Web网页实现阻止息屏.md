---
date: 2024-04-10 13:40:22
url: 
tags: 
  - javascript
  - vue
title: 大屏可视化-实现阻止息屏
---

## 前言

> 在平时中，我们可能将电脑屏幕息屏时间定的比较短，这样，在空闲的时候会息屏省电。而在另一方面有时在一些场景下我们可能需要保持屏幕常亮;比如在大屏可视化的场景，为了方便用户长期打开大屏可视化，不用修改系统设置就能不休眠，稳定长期使用。
>
> 所以这时候需要阻止息屏，就可以使用这里的WakeLock API了。
>
> MDN:[WakeLock - Web API 接口参考 | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/API/WakeLock)
>
> 谷歌官方文档:[使用 Screen Wake Lock API 不锁定屏幕  | Capabilities  | Chrome for Developers](https://developer.chrome.com/docs/capabilities/web-apis/wake-lock?hl=zh-cn)
>
> ***注意：***
>
> ***此项功能仅在一些支持的浏览器的安全上下文（HTTPS）中可用。***
>
> 预览地址：https://blog-demos-yijun.vercel.app/useWakeLock

## 浏览器兼容性

> [WakeLock - Web API 接口参考 | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/API/WakeLock#浏览器兼容性)

![image-20240410133352430](https://cdn.zytsxt.com//blogimage-20240410133352430.png)

## API的基本使用

```js
try {
  const wakeLock = await navigator.wakeLock.request('screen')
}
catch (err) {
  // 唤醒锁请求失败——通常是系统原因，例如设备电量不足
  console.log(`${err.name}, ${err.message}`)
}
```

## 页面可视状态下的优化

上面API的使用只是锁定屏幕，在页面缩小，页面切换等状态下会自动停止，所以需要手动去优化，在恢复页面的时候继续保持常量

```js
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible')
    navigator.wakeLock.request('screen')

})
```

`navigator.wakeLock.request(‘screen’)`这个Promise执行后的返回值是WakeLockSentinel 对象，通过这个对象可以得到当前屏幕锁定的释放状态，结合使用上面的代码完成对唤醒锁定的自动开启和和状态监控

```js
let wakeLock = null;
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    navigator.wakeLock.request('screen').then(result => {
      wakeLock = result;

      console.log('唤醒锁定已激活');
      wakeLock.addEventListener('release', () => {
        console.log('唤醒锁定已释放');
      });
    })
  }
```

## 封装为hook

```typescript
/**
* @description 阻止息屏hook
* @author yijun <2841159677@qq.com>
* @created 2024-04-10 13:43:20
*/

export function useWakeLock() {
    // 阻止屏幕息屏
    let wakeLock: any = null;
    const initWakeLock = async () => {
        const requestWakeLock = async () => {
            try {
                wakeLock = await navigator.wakeLock.request("screen");
                wakeLock.addEventListener('release', () => {
                    console.log('Screen Wake Lock released:', wakeLock.released);
                });
                console.log('Screen Wake Lock released:', wakeLock.released);
            } catch (err:any) {
                return new Error(`${err.name}, ${err.message}`);  
            }
        };

        /**
        * 上面requestWakeLock方法只是锁定屏幕
        * 在页面缩小，页面切换等状态下会自动停止；
        * 所以需要手动去优化，在恢复页面的时候继续保持常量
        */
        const handleVisibilityChange = async () => {
            if (wakeLock !== null && document.visibilityState === 'visible') {
                await requestWakeLock();
            }
        };
        console.log(navigator)
        // 检测浏览器是否支持 此项功能仅在一些支持的浏览器的安全上下文（HTTPS）中可用。
        if ("wakeLock" in navigator) {
            document.addEventListener('visibilitychange', handleVisibilityChange);
            await requestWakeLock();
        } else {
            return new Error('Wake Lock API is not supported.');  
        }

    }
    // 解除屏幕唤醒锁定
    const stopWakeLock = () => {
        wakeLock.release();
        wakeLock = null;
    }

    return {
        initWakeLock,
        stopWakeLock
    }
}
```

## 使用示例

```vue
<template>
    <div class="useWakeLock w-full h-full left-0 top-0 absolute flex items-center justify-center">
        <el-button @click="init" color="#07E489" size="large">阻止屏幕息屏</el-button>
        <el-button @click="stopWakeLock" color="#0175FF" size="large">解除屏幕息屏限制</el-button>
    </div>
</template>
<script lang="ts" setup>
import { useWakeLock } from '~/hooks/useWakeLock'
const { initWakeLock, stopWakeLock } = useWakeLock()
import { ElMessage } from 'element-plus'
const init = async () => {
    await initWakeLock().then(() => {
        ElMessage.success('阻止屏幕息屏成功')
    }).catch((err: string) => {
        ElMessage.error(err)
    })
}

const stop = async () => {
    stopWakeLock()
    ElMessage.success('解除屏幕唤醒锁定成功')
}


</script>

<style lang="scss" scoped>
.useWakeLock {
    background-image: linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%);
}
</style>
```

![image-20240410152014469](https://cdn.zytsxt.com//blogimage-20240410152014469.png)

## 结语

> 这个属性在演示的时候有很大作用
>
> 但是必须要在https的环境下才能使用或调试 