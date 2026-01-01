<!-- <script setup>
definePageMeta({
  layout: "custom",
  middleware: ["auth"],
});

const { makes } = useCars();
const user = useSupabaseUser();
console.log("SSR / initial → user:", user.value)

onMounted(() => {
  console.log("Client-side بعد hydration → user:", user.value)
  console.log("Client-side user.id:", user.value?.id)
})
const info = useState("adInfo", () => {
  return {
    make: "",
    model: "",
    year: "",
    miles: "",
    price: "",
    city: "",
    features: "",
    seats: "",
    description: "",
    image: "awwd",
  };
});
const errorMessage = ref("");
const onChangeInput = (data, name) => {
  info.value[name] = data;
};

const inputs = [
  {
    id: 1,
    title: "Model *",
    name: "model",
    placeholder: "Civic",
  },

  {
    id: 2,
    title: "Year *",
    name: "year",
    placeholder: "2000",
  },
  {
    id: 3,
    title: "Price *",
    name: "price",
    placeholder: "1000",
  },
  {
    id: 4,
    title: "Miles *",
    name: "miles",
    placeholder: "1000",
  },
  {
    id: 5,
    title: "City *",
    name: "city",
    placeholder: "Austin",
  },
  {
    id: 6,
    title: "Number of Seats *",
    name: "seats",
    placeholder: "4",
  },
  {
    id: 7,
    title: "Features *",
    name: "features",
    placeholder: "Leathe Interior, no accidents",
  },
];

const isButtonDisabled = computed(() => {
  for (let key in info.value) {
    if (!info.value[key]) return true;
  }
  return false;
});

const handleSubmit = async () => {
  const body = {
    ...info.value,
    listerId: user.value.id,
    city: info.value.city.toLowerCase(),
    features: info.value.features.split(", "),
    numberOfSeats: parseInt(info.value.seats),
    year: parseInt(info.value.year),
    price: parseInt(info.value.price),
    miles: parseInt(info.value.miles),
    name: `${info.value.make} ${info.value.model}`,
    image: "https://placehold.co/800x600?text=Car+Image",
  };

  delete body.seats;

  try {
    const response = await $fetch("/api/car/listings", {
      method: "post",
      body,
    });
    navigateTo("/profile/listings");
  } catch (err) {
    errorMessage.value = err.statusMessage;
  }
};
</script> -->


<script setup>
definePageMeta({
  layout: "custom",
  middleware: ["auth"],
});

const { makes } = useCars();
const user = useSupabaseUser();
const errorMessage = ref("");

const info = useState("adInfo", () => ({
  make: "",
  model: "",
  year: "",
  miles: "",
  price: "",
  city: "",
  features: "",
  seats: "",
  description: "",
  image: "",
}));

const onChangeInput = (data, name) => {
  info.value[name] = data;
};

const inputs = [
  { id: 1, title: "Model *", name: "model", placeholder: "Civic" },
  { id: 2, title: "Year *", name: "year", placeholder: "2000" },
  { id: 3, title: "Price *", name: "price", placeholder: "1000" },
  { id: 4, title: "Miles *", name: "miles", placeholder: "1000" },
  { id: 5, title: "City *", name: "city", placeholder: "Austin" },
  { id: 6, title: "Number of Seats *", name: "seats", placeholder: "4" },
  { id: 7, title: "Features *", name: "features", placeholder: "Leather Interior, no accidents" },
];

const isButtonDisabled = computed(() => {
  for (const key in info.value) {
    if (key !== "image" && !info.value[key]) return true;
  }
  return false;
});

const handleSubmit = async () => {
  
  if (!user.value) {
    errorMessage.value = "کاربر لاگین نیست – لطفاً دوباره وارد شوید";
    return;
  }

  const listerId = user.value.sub || user.value.id || "";

  if (!listerId) {
    errorMessage.value = "شناسه کاربر پیدا نشد – لطفاً لاگین را چک کنید";
    console.error("هیچ sub یا id در user.value وجود ندارد", user.value);
    return;
  }


  const rawFeatures = (info.value.features || "").trim();
  const featuresArray = rawFeatures
    ? rawFeatures.split(/,\s*/).map(s => s.trim()).filter(Boolean)
    : [];

  const body = {
    make: (info.value.make || "").trim(),
    model: (info.value.model || "").trim(),
    year: info.value.year ? Number(info.value.year) : null,
    miles: info.value.miles ? Number(info.value.miles) : null,
    price: info.value.price ? Number(info.value.price) : null,
    city: (info.value.city || "").trim().toLowerCase(),
    numberOfSeats: info.value.seats ? Number(info.value.seats) : null,
    features: featuresArray,
    description: (info.value.description || "").trim(),
    image: "https://placehold.co/800x600?text=Car+Image", // موقت   
    listerId, // ← اینجا از sub یا id استفاده شد
    name: [(info.value.make || ""), (info.value.model || "")].filter(Boolean).join(" ").trim() || "",
  };

  // دیباگ
  console.log("داده ارسالی به API:", JSON.stringify(body, null, 2));

 
  if (!body.make || !body.model || isNaN(body.year) || featuresArray.length === 0) {
    errorMessage.value = "لطفاً فیلدهای ضروری (برند، مدل، سال، ویژگی‌ها) را پر کنید";
    return;
  }

  try {
    await $fetch("/api/car/listings", {
      method: "POST",
      body,
    });

    navigateTo("/profile/listings");
  } catch (err) {
    console.error("خطای ثبت آگهی:", err);

    if (err.data?.errors) {
      errorMessage.value = err.data.errors.join(" • ") || "داده‌های ارسالی نامعتبر است";
    } else {
      errorMessage.value = err.statusMessage || "خطا در ارتباط با سرور";
    }
  }
};
</script>
<template>
  <div>
    <div class="mt-24">
      <h1 class="text-6xl">Create a New Listing</h1>
    </div>
    <div class="shadow rounded p-3 mt-5 flex justify-between flex-wrap">
      <CarAdSelect
        title="make *"
        :options="makes"
        name="make"
        @change-input="onChangeInput"
      />
      <CarAdInput
        v-for="input in inputs"
        :key="input.id"
        :title="input.title"
        :name="input.name"
        :placeholder="input.placeholder"
        @change-input="onChangeInput"
      />
      <CarAdTextarea
        title="Description *"
        name="description"
        placeholder=""
        @change-input="onChangeInput"
      />
      <CarAdImage @change-input="onChangeInput" />
      <div>
        <button
          :disabled="isButtonDisabled"
          @click="handleSubmit"
          class="bg-blue-400 text-white rounded py-2 px-7 mt-3"
        >
          Submit
        </button>
        <p v-if="errorMessage" class="mt-3 text-red-400">
          {{ errorMessage }}
        </p>
      </div>
    </div>
  </div>
</template>
