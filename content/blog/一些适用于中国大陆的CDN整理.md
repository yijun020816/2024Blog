---
date: 2024-04-10 09:10:22
url: 
tags: 
  - 转载
title: 🔗「转载」一些适用于中国大陆的CDN整理
---

原文地址：[https://lainbo.com/article/mainland-china-cdn](https://lainbo.com/article/mainland-china-cdn)

由于某些众所周知的原因, 很多开源的库、开箱即用的Blog模板采用的都是国外CDN, 在大陆访问速度不尽人意, 这可能导致你的网站打开速度非常慢, 我整理收集了目前稳定运行的免费CDN站, 能让你的站点资源在国内外都获得不错的速度。

---

文中的链接如果不是一个a标签, 代表这个CDN没有可视化的页面, 但是可以通过拼接字符获取到相关资源。
### 大厂运营：
#### 七牛云存储
[https://staticfile.net/](https://staticfile.net/)
#### Bootstrap
出现过多次负面消息, 比如网站宕机, 被投毒等
[https://www.bootcdn.cn/](https://www.bootcdn.cn/)
#### 字节跳动静态资源公共库
不更新了, 但已有的资源速度很快
[https://cdn.bytedance.com/](https://cdn.bytedance.com/)
#### 饿了么 (未公开发布)

- https://npm.elemecdn.com/

例如: https://npm.elemecdn.com/jquery@3.2.1/dist/jquery.min.js

- https://github.elemecdn.com/

例如: https://github.elemecdn.com/hexo-theme-a4@latest/source/css/markdown.css
这两个的使用方式参考UNPKG
#### 知乎
[https://unpkg.zhimg.com](https://unpkg.zhimg.com)
#### 360 前端静态资源库
目前首页404但资源可用, [字体加速页面](https://cdn.baomitu.com/index/fonts)正常
[https://cdn.baomitu.com/](https://cdn.baomitu.com/)

---

你可能会发现, 国内大厂的要么不好用, 要么资源少, 要么不更新, 未公开的CDN人家未来某天把url换了咱也没地说理去, 所以更建议使用下面这些CDN站点, 但请遵守他们各自的TOS
### 知名院校以及非盈利机构运营
#### **渺软公益**(推荐)
可以回源 jsDelivr, UNPKG, cdnjs, 用法与回源的项目一致
官网: [https://cdn.onmicrosoft.cn/](https://cdn.onmicrosoft.cn/)
#### Web缓存网(推荐)
[https://www.webcache.cn/](https://www.webcache.cn/)
#### 南方科技大学
[https://mirrors.sustech.edu.cn/help/cdnjs.html](https://mirrors.sustech.edu.cn/help/cdnjs.html)
#### 重庆邮电大学
[https://mirrors.cqupt.edu.cn:443](https://mirrors.cqupt.edu.cn/)
### 个人运营：

- [https://u.sb/css-cdn/](https://u.sb/css-cdn/)
- [https://bilicdn.tk](https://bilicdn.tk/)
- [https://www.xxhzm.cn/archives/733/](https://www.xxhzm.cn/archives/733/)
- [https://jsd.cdn.zzko.cn/](https://jsd.cdn.zzko.cn/)
