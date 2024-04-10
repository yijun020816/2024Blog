<script setup lang="ts">
const contentQuery = await queryContent().find()
// 获取tag图标
const getTagIcon = (title: string) => {
  const obj = {
    Nuxt3: 'icon-nuxt',
    Vue: 'icon-Vue',
  }
  if (!obj[title as keyof typeof obj])
    return `<span class="hover">#${title}</span>`
  else
    return `<span class="hover iconfont ${obj[title as keyof typeof obj]}">#${title}</span>`
}
const tagsContent = contentQuery
  .filter(i => i.tags) // 过滤无tags的选项
  .filter((i) => {
    const regex = /(readme|about)\.md$/i // 匹配 /readme.md 或 /about.md
    return !regex.test(i._file!) // 如果不匹配，则保留该项
  })
  .reduce((counts, post) => {
    for (const tag of post.tags) {
      if (counts[tag])
        counts[tag]++

      else
        counts[tag] = 1
    }
    return counts
  }, {} as { [key: string]: number })
</script>

<template>
  <h1 class="text-title mb-2em font-bold">
    Tags
  </h1>
  <ul class="flex gap-1em flex-wrap">
    <li v-for="(value, key, index) in tagsContent" :key="key" slide-enter :style="{ '--stagger': index + 1 }" class="px-2 bg-gray-400:20 rd-1">
      <NuxtLink :to="`/tags/${key}`" class="flex gap-2">
        <div v-html="getTagIcon(key as string)" />
        <!-- <span class="hover" :class="">#{{ key }}</span> -->
        <span>{{ value }}</span>
      </NuxtLink>
    </li>
  </ul>
</template>
