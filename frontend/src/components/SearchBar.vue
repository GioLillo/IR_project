<template>
  <div class="flex justify-center items-center">
    <!-- Search Bar Container -->
    <div class="flex w-full max-w-2xl border rounded-full shadow-md bg-white overflow-hidden">
      <!-- Search Icon -->
      <div class="flex items-center justify-center px-4">
        <i class="pi pi-search text-lg"></i>
      </div>
      <!-- Input Field -->
      <input
          type="text"
          v-model="searchQuery"
          placeholder="Search for nannies or babysitters..."
          class="flex-grow p-3 text-gray-700 focus:outline-none"
          @keydown.enter="onSearch"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchBar",
  data() {
    return {
      searchQuery: "",
    };
  },
  methods: {
    onSearch() {
      this.$emit("search", this.searchQuery);
    },
  },
};
</script>

<style scoped>

</style>
