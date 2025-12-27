<script setup>
const error = useError();
const handlerError = () => {
  clearError({
    redirect: "/",
  });
};
</script>

<template>
  <div class="flex items-center justify-center flex-col h-screen">
    <h1 class="text-9xl">{{ error.statusCode }}</h1>
    <p class="mt-7 text-4xl">{{ error.statusMessage }}</p>
    <button
      class="border py-4 px-7 bg-blue-400 text-white mt-7 rounded text-2xl"
      @click="handlerError"
    >
      Go Back
    </button>
  </div>
</template>
