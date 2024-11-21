<template>
  <div class="container mx-auto py-6">

    <!-- Results Container -->
    <div v-if="filteredResults.length" class="space-y-4">
      <div
          v-for="(result, index) in filteredResults"
          :key="index"
          class="p-4 border rounded-lg shadow-md"
      >
        <a
            :href="result.href"
            target="_blank"
            class="text-blue-600 hover:underline text-lg font-semibold"
        >
          <span v-html="highlight(result.header)"></span>
        </a>
        <p class="text-gray-700 mt-2">
          <span v-html="highlight(result.description)"></span>
        </p>
      </div>
    </div>

    <!-- No Results Message -->
    <p v-else class="text-gray-600">No results found for your search.</p>
  </div>
</template>

<script>
export default {
  name: "SearchResults",
  props: ["query"],
  data() {
    return {
      results: [], // Holds all results from the backend
    };
  },
  computed: {
    filteredResults() {
      if (!this.query) return this.results;
      const searchTerm = this.query.toLowerCase();
      return this.results.filter(
          (result) =>
              result.header.toLowerCase().includes(searchTerm) ||
              result.description.toLowerCase().includes(searchTerm)
      );
    },
  },
  methods: {
    highlight(text) {
      if (!this.query) return text;
      const regex = new RegExp(`(${this.query})`, "gi");
      return text.replace(regex, "<mark>$1</mark>");
    },
    fetchData() {
      fetch("http://localhost:3000/api/results")
          .then((response) => response.json())
          .then((data) => {
            this.results = data;
          })
          .catch((error) => console.error("Error fetching data:", error));
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>

