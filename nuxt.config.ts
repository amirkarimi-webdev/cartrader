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

  // این بخش برای client-side خوبه (در مرورگر)
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY,
    },
  },

  // ← این دو خط مهم‌ترین تغییر هستن!
  supabase: {
    url: process.env.SUPABASE_URL,           // برای server-side
    key: process.env.SUPABASE_ANON_KEY,       // برای server-side

    redirectOptions: {
      login: "/login",
      callback: "/profile/listings",          // یا '/' اگر می‌خوای اول به خانه بره
      exclude: ["/", "/login"],               // صفحات عمومی
    },
  },
})