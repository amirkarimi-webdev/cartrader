<script setup>
const route = useRoute();

const { data: cars, refresh } = await useFetchCars(route.params.city, {
  minPrice: route.query.minPrice,
  maxPrice: route.query.maxPrice,
  make: route.query.make,
});

watch(
  () => route.query,
  () => {
    window.location.reload(true);
  }
);
</script>

<template>
  <div>
    <CarCards :cars="cars" />
  </div>
</template>

<!-- city/:city/car/:make -> (car and city is static and (:city) is dynamic and (:make) is optional ) -->


