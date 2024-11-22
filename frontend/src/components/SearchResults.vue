<template>
  <!-- Search Bar -->
  <header class="p-8 pl-16 pr-16">
    <div class="flex items-center">
      <div class="flex w-full max-w-2xl border rounded-full shadow-md bg-white overflow-hidden focus-within:ring-2 focus-within:ring-violet-500">
        <!-- Search Icon -->
        <div class="flex items-center justify-center px-4">
          <i class="pi pi-search text-lg font-semibold text-violet-500"></i>
        </div>
        <!-- Input Field -->
        <input
            ref="searchInput"
            type="text"
            v-model="searchQuery"
            class="flex-grow p-3 text-gray-700 focus:outline-none"
            @keydown.enter="performSearch"
        />
        <!-- delete icon -->
        <div
            class="flex items-center justify-center px-8 cursor-pointer"
            @click="clearSearch"
            v-if="searchQuery !== ''"
        >
          <i class="pi pi-times text-lg font-semibold text-violet-500"></i>
        </div>
      </div>
    </div>
  </header>

  <!-- Divider -->
  <div class="w-full border-b border-gray-300 mb-4"></div>

  <!-- Search Results Section -->
  <main class="flex space-x-4 pl-20">
    <!-- Search Results -->
    <div class="flex-1">
      <h2 class="text-lg font-semibold text-gray-800 mb-3">Search Results for "{{ displayQuery }}"</h2>
      <ul class="space-y-4">
        <li v-for="result in results" :key="result.id" class="p-4 border rounded-md shadow-sm bg-white">
          <h3 class="font-bold text-violet-600">{{ result.title }}</h3>
          <p class="text-gray-600">{{ result.description }}</p>
        </li>
      </ul>
    </div>

    <!-- Divider -->
    <div class="border-l border-gray-300"></div>

    <!-- Suggestions Section -->
    <aside class="w-1/3 pr-20">
      <h2 class="text-lg font-semibold text-gray-800 mb-3">Suggested</h2>
      <ul class="space-y-4">
        <li v-for="suggestion in suggestions" :key="suggestion.id" class="p-4 border rounded-md shadow-sm bg-white">
          <h3 class="font-bold text-violet-600">{{ suggestion.title }}</h3>
          <p class="text-gray-600">{{ suggestion.description }}</p>
        </li>
      </ul>
    </aside>
  </main>

</template>

<script>
export default {
  name: "SearchResults",
  data() {
    return {
      searchQuery: this.$route.query.query || "",
      displayQuery: this.$route.query.query || "",
      results: [], // Risultati
      suggestions: [], // Suggerimenti
    };
  },
  methods: {
    performSearch() {
      this.$router.push({ query: { query: this.searchQuery } });
      this.fetchResults();
      this.$refs.searchInput.blur();
    },
    clearSearch() {
      this.searchQuery = "";
      this.$nextTick(() => {
        this.$refs.searchInput.focus();
      });
    },
    fetchResults() {
      // Legge la query dalla query string
      this.displayQuery = this.searchQuery;
      // Simula il caricamento dei dati
      this.results = [
        { id: 1, title: `Result for "${this.searchQuery}"`, description: "Description of Result 1" },
        { id: 2, title: `Another Result for "${this.searchQuery}"`, description: "Description of Result 2" },
      ];
      this.suggestions = [
        { id: 1, title: "Suggested 1", description: "Description of Suggested 1" },
        { id: 2, title: "Suggested 2", description: "Description of Suggested 2" },
      ];
    },
  },
  mounted() {
    this.fetchResults();
  },
  watch: {
    "$route.query.query": "fetchResults",
  },
};
</script>
