<template>
  <div class="bg-violet-50 min-h-screen p-8 flex flex-col justify-center">
    <div class="mb-72 mt-9">
      <header class="text-center mb-8">
        <h1 class="text-6xl font-bold text-violet-icon">Nanny Search</h1>
      </header>
      <main>
        <SearchBar @search="performSearch" />
        <!--      <SearchResults :query="searchQuery" />-->
      </main>
    </div>
  </div>
</template>

<script>
import SearchBar from './components/SearchBar.vue'
// import SearchResults from "@/components/SearchResults.vue";

export default {
  name: 'App',
  components: {
    SearchBar,
    // SearchResults
  }
}
</script>

<style scoped>

</style>
