<script setup>
import heartFilled from "@/assets/heartFilled.png";
import heartOutline from "@/assets/heartOutline.png";
const props = defineProps({
  car: Object,
  favored: Boolean,
});

const emit = defineEmits(["favor"]);
</script>

<template>
  <div
    class="relative shadow border w-full h-[200px] cursor-pointer overflow-hidden mb-5"
  >
    <img
      class="absolute w-7 right-5 top-2 z-20"
      :src="favored ? heartFilled : heartOutline"
      @click="emit('favor', car.id)"
      alt=""
    />
    <div class="flex h-full" @click="navigateTo(`/car/${car.name}-${car.id}`)">
      <NuxtImg :src="car.image" :alt="car.name" class="w-[300px] h-full" />
      <div class="flex flex-col p-4">
        <div>
          <h1 class="text-blue-700 text-2xl">{{ car.name }}</h1>
          <p class="text-gray-700">
            {{ car.description }}
          </p>
        </div>
        <h1 class="mt-auto text-xl">${{ car.price }}</h1>
      </div>
    </div>
  </div>
</template>
