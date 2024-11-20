<template>
  <div class=" min-h-screen p-8">
    <header class="text-center mb-8">
      <h1 class="text-6xl font-bold text-indigo-600">Blinky</h1>
    </header>
    <main>
      <SearchBar @search="performSearch" />
    </main>
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

<style>
</style>
