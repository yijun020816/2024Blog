<script setup lang="ts">
import Giscus from '@giscus/vue'

const route = useRoute()
const post = route.params.post as Array<string>
const path = post.join('/')
</script>

<template>
  <section class="prose relative slide-enter-content">
    <ContentDoc :path="path">
      <template #default="{ doc }">
        <doc-back />
        <doc-render :article="doc" />
        <doc-toc :toc="doc.body.toc" />
        <Giscus
          repo="yijun020816/2024Blog"
          repo-id="R_kgDOLrP12w"
          category="Q&A"
          category-id="DIC_kwDOLrP1284Celdz"
          mapping="pathname"
          strict="0"
          reactions-enabled="1"
          emit-metadata="0"
          input-position="top"
          theme="light"
          lang="zh-CN"
          loading="lazy"
          crossorigin="anonymous"
          async
        />
      </template>

      <template #empty>
        <h1 class="text-center">
          Document is empty😅
        </h1>
      </template>

      <template #not-found>
        <h1 class="text-center">
          Not Found Any Document😗
        </h1>
      </template>
    </ContentDoc>
  </section>
</template>
