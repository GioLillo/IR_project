<template>
  <div class="flex flex-col min-h-screen">
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
              v-model="localSearchQuery"
              class="flex-grow p-3 text-gray-700 bg-white focus:outline-none"
              @keydown.enter="performSearch"
          />
          <!-- Delete Icon -->
          <div
              class="flex items-center justify-center px-8 cursor-pointer"
              @click="clearSearch"
              v-if="localSearchQuery !== ''"
          >
            <i class="pi pi-times text-lg font-semibold text-violet-500"></i>
          </div>
        </div>

        <div class="flex items-center space-x-4 ml-4">
          <!-- Age Slider -->
          <div class="flex items-center">
            <label class="mr-4 text-gray-700">Age:</label>
            <Slider
              v-model="ageRange"
              range
              class="w-40"
              :min="10"
              :max="100"
              @change="updateFilters"
            />
            <span class="ml-4 text-gray-600">{{ ageRange[0] }} - {{ ageRange[1] }}</span>
          </div>
          <!-- Salary Slider -->
          <div class="flex items-center">
            <label class="mr-4 text-gray-700">Salary:</label>
            <Slider
              v-model="salaryRange"
              range
              class="w-40"
              :min="0"
              :max="40"
              @change="updateFilters"
            />
            <span class="ml-4 text-gray-600">{{ salaryRange[0] }} - {{ salaryRange[1] }}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Divider -->
    <div class="w-full border-b border-gray-300 mb-4"></div>

    <div v-if="isLoading" class="flex justify-center items-center flex-grow">
      <i class="pi pi-spin pi-spinner font-extrabold text-violet-500"></i> 
      <p class="ml-2 text-xl text-gray-700">Loading...</p>
    </div>

    <!-- Search Results Section -->
    <main v-else class="flex space-x-4 pl-20 flex-grow">

      <!-- Search Results -->
      <div class="flex-1">
        <h2 class="text-lg font-semibold text-gray-800 mb-3">
          Search Results for "{{ displayQuery }}"
        </h2>
        <ul class="space-y-4">
          <li v-for="result in results" :key="result.href" class="p-4 border rounded-md shadow-sm bg-white">
            <h3 class="font-bold text-violet-600">
              <a :href="result.href" target="_blank">{{ result.name }}</a>
            </h3>
            <p class="text-gray-600">
              Age: {{ result.age }},
              Salary: {{ result.salary }},
            </p>
            <p class="text-gray-600" v-html="result.description"></p>
          </li>
        </ul>
        <h3 v-if="results.length==0" class="font-bold text-xl text-violet-600">
          No results found for: "{{ displayQuery }}"
        </h3>
      </div>

      <!-- Divider -->
      <div v-if="suggestions.length <= 1" class="h-[220px] border-l border-gray-300"></div>
      <div v-if="suggestions.length == 2" class="h-[360px] border-l border-gray-300"></div>
      <div v-if="suggestions.length >= 3" class="h-[520px] border-l border-gray-300"></div>

      <!-- Suggestions Section -->
      <aside class="w-1/3 pr-20">
        <h2 class="text-lg font-semibold text-gray-800 mb-3">Suggested</h2>
        <ul class="space-y-4">
          <li
              v-for="suggestion in suggestions"
              :key="suggestion.href"
              class="p-4 border rounded-md shadow-sm bg-white"
          >
            <h3 class="font-bold text-violet-600">
              <a :href="suggestion.href" target="_blank">{{ suggestion.name }}</a>
            </h3>
            <p class="text-gray-600" v-html="suggestion.description"></p>
          </li>
        </ul>
      </aside>
    </main>

    <!-- Pagination -->
    <footer class="flex justify-center mt-6 p-4 pb-8 border-gray-300">
      <Paginator
          v-model:page="currentPage"
          :rows="10"
          :totalRecords="totalResults"
          :pageLinkSize="5"
          @pageChange="changePage"
      />
    </footer>
  </div>
</template>

<script>
import axios from "axios";
import Slider from 'primevue/slider';
import Paginator from 'primevue/paginator';

export default {
  name: "SearchResults",
  components: {
    Slider,
    Paginator
  },
  props: {
    searchQuery: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      localSearchQuery: this.searchQuery,
      displayQuery: this.searchQuery,
      results: [],
      totalResults: 0,
      currentPage: 1,
      resultsPerPage: 10,
      suggestions: [],
      ageRange: [10, 100],
      salaryRange: [0, 40],
      isLoading: false,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalResults / this.resultsPerPage);
    },
  },
  watch: {
    localSearchQuery(newValue) {
      this.$emit("update:searchQuery", newValue);
    },
    searchQuery(newValue) {
      this.localSearchQuery = newValue;
    },
  },
  methods: {
    async fetchResults() {
      this.isLoading = true;
      try {
          const url = `http://localhost:3000/api/results?query=${this.localSearchQuery}&page=${this.currentPage}&ageRange=${JSON.stringify(this.ageRange)}&salaryRange=${JSON.stringify(this.salaryRange)}`;

          const response = await axios.get(url);
          const data = response.data;

          this.results = data[0].map((item) => ({
              href: item.href[0],
              name: item.name[0],
              age: parseInt(item.age[0], 10),
              salary: typeof item.salary[0] === 'string'
              ? parseFloat(item.salary[0].replace(/[^0-9.]/g, ''))
              : item.salary[0],
              description: item.description[0],
          }));

          this.results = this.results.filter((item) => {
            const age = parseInt(item.age, 10); 
            let salary;

            if (typeof item.salary === 'string') {
              salary = parseFloat(item.salary.replace(/[^0-9.]/g, ''));
            } else if (typeof item.salary === 'number') {
              salary = item.salary;
            } else {
              return false;
            }

            return (
              age >= this.ageRange[0] &&
              age <= this.ageRange[1] &&
              salary >= this.salaryRange[0] &&
              salary <= this.salaryRange[1]
            );
          });
          
          this.suggestions = data[1].map((item) => ({
              href: item.href,
              name: item.name[0],
              description: item.description,
          }));
      } catch (error) {
          console.error("Errore nel recupero dei dati:", error);
      } finally {
          this.isLoading = false;
      }
    },
    performSearch() {
      this.currentPage = 1;
      this.displayQuery = this.localSearchQuery;
      this.fetchResults();
      this.$refs.searchInput.blur();
    },
    clearSearch() {
      this.localSearchQuery = "";
      this.totalResults = 0;
      this.currentPage = 1;
      this.$nextTick(() => {
        this.$refs.searchInput.focus();
      });
    },
    changePage(event) {
      this.currentPage = event.page+1; 
      this.fetchResults();
    },
    updateFilters() {
      this.fetchResults();  
    },
  },
  mounted() {
    this.fetchResults();
  },
};
</script>

<style scoped>
button {
  transition: all 0.3s ease;
}
button:hover {
  transform: scale(1.05);
}
</style>