<script setup>
const route = useRoute();
const { data: car } = await useFetchcCar(route.params.id);
const { toTitleCase } = useUtilities();
useHead({
  title: toTitleCase(route.params.name),
});

definePageMeta({
  layout: "custom",
});
</script>

<template>
  <div v-if="car">
    <CarDetailHero :car="car" />
    <CarDetailAtrributes :features="car.features" />
    <CarDetailDescription :description="car.description" />
    <CarDetailContact />
  </div>
</template>

<!-- car/:name-:id  -> (-) is static-->
