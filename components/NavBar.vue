<script setup>
const user = useSupabaseUser();
const supabase = useSupabaseClient();

const logout = async () => {
  const { error } = supabase.auth.signOut();

if (error) {
    console.error('خطا در خروج:', error)
  } else {
    await navigateTo('/login')
  }
};
</script>

<template>
  <header
    class="sticky top-0 z-50 flex justify-between items-center space-x-1 border-b bg-white p-4 shadow-md"
  >
    <NuxtLink class="font-mono text-2xl" to="/">cartrader</NuxtLink>

    <div v-if="user" class="flex">
      <NuxtLink to="/profile/listings" class="mr-5">Profile </NuxtLink>
      <button class="cursor-pointer" @click="logout">Logout</button>
    </div>
    <NuxtLink v-else to="/login">Login</NuxtLink>
  </header>
</template>
