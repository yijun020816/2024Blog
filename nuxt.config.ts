// https://nuxt.com/docs/api/configuration/nuxt-config
import { siteConfig } from './site.config'
import prerenderRoutes from './prerenderRoutes.json'

export default defineNuxtConfig({
  modules: [
    '@unocss/nuxt',
    '@vueuse/nuxt',
    '@nuxt/content',
    '@nuxtjs/stylelint-module',
  ],
  devServer: {
    host: '0.0.0.0',
    port: 3001,
  },
  nitro: {
    prerender: {
      routes: prerenderRoutes,
    },
  },
  app: {
    rootId: 'nuxt-root',
    head: {
      meta: [
        { name: 'description', content: siteConfig.description },
        { name: 'author', content: siteConfig.author },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'revisit-after', content: '7 days' },
        { name: 'msapplication-TileColor', content: '#ffffff' },
        { charset: 'UTF-8' },
        { 'http-equiv': 'X-UA-Compatible', 'content': 'IE=edge' },
      ],
      noscript: [
        { children: 'JavaScript is required' },
      ],
      link: [
        {
          type: 'text/css',
          rel: 'stylesheet',
          href: 'https://at.alicdn.com/t/c/font_3855138_irdxpj6pg9c.css',
        },
      ],
      htmlAttrs: {
        lang: siteConfig.lang,
      },
      bodyAttrs: {
        class: 'font-sans',
      },
      script: [
        {
          src: 'https://sdk.51.la/js-sdk-pro.min.js',
          id: 'LA_COLLECT',
          type: 'text/javascript',
        },
        {
          innerHTML: `
          LA.init({id:"3I6Hx8rqbv1QDb6d",ck:"3I6Hx8rqbv1QDb6d",autoTrack:true,hashMode:true})
          `,
        },
      ],
    },
  },

  content: {
    highlight: {
      theme: {
        // Default theme (same as single string)
        default: 'github-dark',
        // Theme used if `html.dark`
        dark: 'github-dark',
        // Theme used if `html.sepia`
        sepia: 'monokai',
      },
      preload: [
        'javascript',
        'typescript',
        'vue',
        'vue-html',
        'c',
        'cpp',
        'java',
      ],

    },
  },
  css: [
    '@unocss/reset/tailwind.css',
    '@/assets/styles/global.scss',
    '@/assets/styles/theme.css',
    '@/assets/styles/transition.css',
    '@/assets/styles/markdown.scss',
  ],
  stylelint: {
    /* module options */
    lintOnStart: false,
  },
})
