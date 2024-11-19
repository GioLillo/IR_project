<template>
  <div class="flex justify-center mb-6">
    <input
        type="text"
        v-model="searchQuery"
        placeholder="Search for nannies or babysitters..."
        class="w-72 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
    <button
        @click="onSearch"
        class="ml-4 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      Search
    </button>
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
