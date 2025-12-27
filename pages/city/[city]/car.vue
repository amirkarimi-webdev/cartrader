<script setup>
const route = useRoute();
const { toTitleCase } = useUtilities();
useHead({
  title: `${
    route.params.make ? toTitleCase(route.params.make) : "Cars"
  } in ${toTitleCase(route.params.city)}`,
});

definePageMeta({
  layout: "custom",
});
</script>

<template>
  <div class="mt-32 flex">
    <NuxtErrorBoundary>
      <CarSideBar />
      <NuxtPage />
      <template #error="{ error, clearError }">
        <div class="text-center mx-auto flex flex-col py-20">
          <h1 class="text-5xl text-red-600 mb-4">
            Sorry, something went wrong
          </h1>

          <code class="block mb-6 text-gray-700">
            {{ error.value?.message }}
          </code>

          <button
            class="text-white bg-blue-400 px-10 py-3 rounded"
            @click="clearError()"
          >
            Go back
          </button>
        </div>
      </template>
    </NuxtErrorBoundary>
  </div>
</template>
