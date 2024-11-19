<template>
  <div id="app" class="bg-gray-100 min-h-screen p-8">
    <header class="text-center mb-8">
      <h1 class="text-4xl font-bold text-indigo-600">Nanny Finder</h1>
      <SearchBar @search="performSearch" />
    </header>
    <main>
<!--      <SearchResults :results="results" :query="query" />-->
    </main>
  </div>
</template>

<script>
import SearchBar from './components/SearchBar.vue'

export default {
  name: 'App',
  components: {
    SearchBar
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
