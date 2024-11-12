// Plugins
import Components from 'unplugin-vue-components/vite'
import Vue from '@vitejs/plugin-vue'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import ViteFonts from 'unplugin-fonts/vite'
import { VitePWA } from 'vite-plugin-pwa'
import mkCert from 'vite-plugin-mkcert';
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import {viteStaticCopy} from "vite-plugin-static-copy";
export default defineConfig({
  plugins: [
     VitePWA({
      includeAssets: ['logo.svg'],
      registerType: 'autoUpdate',
      manifest: {
         name: 'My Awesome App',
         short_name: 'AwesomeApp',
         description: 'An awesome app built with Vue and Vite',
         theme_color: '#ffffff',
         icons: [
           {
             src: 'pwa-64x64.png',
             sizes: '64x64',
             type: 'image/png'
           },
           {
             src: 'pwa-192x192.png',
             sizes: '192x192',
             type: 'image/png'
           },
           {
             src: 'pwa-512x512.png',
             sizes: '512x512',
             type: 'image/png',
             purpose: 'any'
           },
           {
             src: 'maskable-icon-512x512.png',
             sizes: '512x512',
             type: 'image/png',
             purpose: 'maskable'
           }
         ]
       },
      devOptions:{
        enabled:true
      },
    }),
  //  mkCert(),
    Vue({
      template: { transformAssetUrls }
    }),
    Vuetify(),
    Components(),
    viteStaticCopy({
      targets: [
        {
          src: 'src/assets/barcode-scanned.mp3',
          dest: 'assets'
        }
      ]
    }),
    ViteFonts({
      google: {
        families: [{
          name: 'Roboto',
          styles: 'wght@100;300;400;500;700;900',
        }],
      },
    }),
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    host: '127.0.1.0',
    port: 80,
  },
})
