<script setup>
const city = ref("");
const { makes } = useCars();
const route = useRoute();
const router = useRouter();

const modal = ref({
  make: false,
  location: false,
  price: false,
});

const priceRange = ref({
  min: "",
  max: "",
});

const priceRangeText = computed(() => {
  const minPrice = route.query.minPrice;
  const maxPrice = route.query.maxPrice;

  if (!minPrice && !maxPrice) return "Any";
  else if (!minPrice && maxPrice) {
    return `< $${maxPrice}`;
  } else if (minPrice && !maxPrice) {
    return `> $${minPrice}`;
  } else {
    return `$${minPrice}-$${maxPrice}`;
  }
});

const updateModal = (key) => {
  modal.value[key] = !modal.value[key];
};

const onChangeLocation = () => {
  if (!city.value) return;
  if (!isNaN(parseInt(city.value))) {
    throw createError({
      statusCode: 400,
      message: "Invalid city format",
    });
  }
  updateModal("location");
  navigateTo(`/city/${city.value}/car/${route.params.make}`);
  city.value = "";
};

const onChangeMake = (make) => {
  updateModal("make");
  navigateTo(`/city/${route.params.city}/car/${make}`);
};

const onChangePrice = (price) => {
  updateModal("price");
  if (priceRange.value.max && priceRange.value.min) {
    if (priceRange.value.min > priceRange.value.max) return;
  }
  router.push({
    query: {
      minPrice: priceRange.value.min,
      maxPrice: priceRange.value.max,
    },
  });
};
</script>

<template>
  <div class="shadow border w-64 mr-10 z-30 h-[190px]">
    <!-- Location Start -->
    <div class="p-5 flex justify-between relative border-b">
      <h3>Location</h3>
      <h3
        class="text-blue-400 capitalize cursor-pointer"
        @click="updateModal('location')"
      >
        {{ route.params.city }}
      </h3>
      <div
        v-if="modal.location"
        class="bg-white absolute shadow left-56 p-5 top-1 -m-1 border"
      >
        <input type="text" class="border p-1 rounded" v-model="city" />
        <button
          class="bg-blue-400 rounded w-full mt-2 text-white p-1"
          @click="onChangeLocation"
        >
          Apply
        </button>
      </div>
    </div>
    <!-- Location End -->

    <!-- Makes Start -->
    <div class="p-5 flex justify-between relative border-b">
      <h3>Make</h3>
      <h3
        class="text-blue-400 capitalize cursor-pointer"
        @click="updateModal('make')"
      >
        {{ route.params.make || "any" }}
      </h3>
      <div
        class="bg-white absolute shadow left-56 p-5 top-1 -m-1 border w-[600px] flex justify-between flex-wrap"
        v-if="modal.make"
      >
        <h4
          class="w-1/3 cursor-pointer"
          v-for="make in makes"
          :key="make"
          @click="onChangeMake(make)"
        >
          {{ make }}
        </h4>
      </div>
    </div>

    <!-- http://localhost:3000/city/daw/car/:namebrand (it optional) -->

    <!-- Makes End -->

    <!-- Price Start -->
    <div class="p-5 flex justify-between relative">
      <h3>Price</h3>
      <h3
        class="text-blue-400 capitalize cursor-pointer"
        @click="updateModal('price')"
      >
        {{ priceRangeText }}
      </h3>
      <div
        class="bg-white absolute shadow left-56 p-5 top-1 -m-1 border"
        v-if="modal.price"
      >
        <input
          type="number"
          class="border p-1 rounded"
          placeholder="min"
          v-model="priceRange.min"
        />
        <input
          type="number"
          class="border p-1 rounded"
          placeholder="max"
          v-model="priceRange.max"
        />
        <button
          class="bg-blue-400 rounded w-full mt-2 text-white p-1"
          @click="onChangePrice"
        >
          Apply
        </button>
      </div>
    </div>

    <!-- http://localhost:3000/city/wad/car/Tesla?minPrice=100&maxPrice=1000 -->
    <!-- price End -->
  </div>
</template>
