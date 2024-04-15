// 预渲染路由
import fs from 'node:fs'

// 白名单
const whitePath = ['me']
function prerenderRoutes() { // 预渲染路由 加快访问速度
  // 读取根目录下的content下的docs文件夹下的所有md
  const files = fs.readdirSync('./content')
  //  遍历files 如果没有后缀名 则为文件夹 则再次遍历
  let routes = []
  files.forEach((file) => {
    if (file.includes('.')) {
      if (whitePath.includes(file.replace('.md', '')))
        return

      routes.push(`/${file.replace('.md', '')}`)
    }
    else {
      const childFiles = fs.readdirSync(`./content/${file}`)
      childFiles.forEach((childFile) => {
        routes.push(`/${file}/${childFile.replace('.md', '')}`)
      })
    }
  })
  routes = ['/', '/search', '/tags', '/blog', ...routes]
  fs.writeFileSync('./prerenderRoutes.json', JSON.stringify(routes))
}

prerenderRoutes()
