<script setup lang="ts">
definePageMeta({
  layout: "custom",
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const route = useRoute()  // برای گرفتن redirect از query

// هر وقت کاربر لاگین شد، اتوماتیک منتقلش کن
watch(user, (newUser) => {
  if (newUser) {
    const redirectPath = (route.query.redirect as string) || '/profile/listings'
    navigateTo(redirectPath)
  }
})

const login = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/', 
    }
  })

  if (error) {
    console.error('خطا در ورود با گوگل:', error)
  }
}
</script>

<template>
  <div class="mt-20 text-center">
    <!-- اگر کاربر لاگین شده باشه (مثلاً دستی به /login اومده) -->
    <div v-if="user">
      <p class="text-4xl font-bold mb-6">خوش آمدی، {{ user.email }}!</p>
      <NuxtLink
        to="/profile/listings"
        class="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-10 rounded-lg text-xl transition"
      >
        برو به پروفایل و آگهی‌ها
      </NuxtLink>
    </div>

    <div v-else>
      <h1 class="text-5xl font-bold mb-10">ورود به حساب</h1>
      <button
        @click="login"
        class="bg-red-500 hover:bg-red-600 text-white font-bold py-5 px-12 rounded-xl text-xl transition shadow-lg"
      >
        ورود با گوگل
      </button>
    </div>
  </div>
</template>