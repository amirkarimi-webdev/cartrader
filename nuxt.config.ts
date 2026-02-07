// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/image",
    "@vueuse/nuxt",
    "@nuxtjs/supabase",
  ],

 
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY,
    },
  },

 
  supabase: {
    url: process.env.SUPABASE_URL,          
    key: process.env.SUPABASE_ANON_KEY,       

    redirectOptions: {
      login: "/login",
      callback: "/profile/listings",          
      exclude: ["/", "/login"],               
    },
  },
})