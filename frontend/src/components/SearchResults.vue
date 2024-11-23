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
          v-model="localSearchQuery"
          class="flex-grow p-3 text-gray-700 focus:outline-none"
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
          <label class="mr-2 text-gray-700">Age:</label>
          <Slider v-model="ageRange" range class="w-40" :min="0" :max="100" @change="performSearch" />
          <span class="ml-2 text-gray-600">{{ ageRange[0] }} - {{ ageRange[1] }}</span>
        </div>
        <!-- Salary Slider -->
        <div class="flex items-center">
          <label class="mr-2 text-gray-700">Salary:</label>
          <Slider v-model="salaryRange" range class="w-40" :min="0" :max="200000" @change="performSearch" />
          <span class="ml-2 text-gray-600">{{ salaryRange[0] }} - {{ salaryRange[1] }}</span>
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
      <h2 class="text-lg font-semibold text-gray-800 mb-3">
        Search Results for "{{ displayQuery }}"
      </h2>
      <ul class="space-y-4">
        <li v-for="result in results" :key="result.href" class="p-4 border rounded-md shadow-sm bg-white">
          <h3 class="font-bold text-violet-600">
            <a :href="result.href" target="_blank">Name : {{ result.name }}</a>
          </h3>
          <p class="text-gray-600">
            Age: {{ result.age }}, 
            Salary: {{ result.salary }},
            Description: {{ result.description }}
          </p>
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
        <li
          v-for="suggestion in suggestions"
          :key="suggestion.href"
          class="p-4 border rounded-md shadow-sm bg-white"
        >
          <h3 class="font-bold text-violet-600">
            <a :href="suggestion.href" target="_blank">{{ suggestion.name }}</a>
          </h3>
          <!-- <p class="text-gray-600">
            Age: {{ suggestion.age }}, Salary: {{ suggestion.salary }}
          </p> -->
          <p class="text-gray-600">{{ suggestion.description }}</p>
        </li>
      </ul>
    </aside>
  </main>
</template>

<script>
import axios from "axios";
import Slider from 'primevue/slider';


export default {
  name: "SearchResults",
  components: {
    Slider, 
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
      suggestions: [], 
      ageRange: [10, 100], 
      salaryRange: [0, 40], 
    };
  },
  computed: {
    filteredResults() {
      return this.results.filter(
        (item) =>
          item.age >= this.ageRange[0] &&
          item.age <= this.ageRange[1] &&
          item.salary >= this.salaryRange[0] &&
          item.salary <= this.salaryRange[1]
      );
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
      try {
        const url = `http://localhost:3000/api/results?query=${this.localSearchQuery}`;

        const response = await axios.get(url);
        const data = response.data;

        this.results = data.map((item) => ({
          href: item.href[0], 
          name: item.name[0], 
          age: item.age[0], 
          salary: item.salary[0], 
          description: item.description[0], 
        }));

        this.suggestions = data.slice(0, 3).map((item) => ({
          href: item.href[0],
          name: item.name[0],
          // age: item.age[0],
          // salary: item.salary[0],
          description: item.description[0],
        }));
      } catch (error) {
        console.error("Errore nel recupero dei dati:", error);
      }
    },
    performSearch() {
      this.displayQuery = this.localSearchQuery;
      this.fetchResults();
      this.$refs.searchInput.blur(); 
    },
    clearSearch() {
      this.localSearchQuery = "";
      this.results = [];
      this.suggestions = [];
      this.$nextTick(() => {
        this.$refs.searchInput.focus(); 
      });
    },
  },
  mounted() {
    this.fetchResults(); 
  },
};
</script>

<style scoped>

</style>

