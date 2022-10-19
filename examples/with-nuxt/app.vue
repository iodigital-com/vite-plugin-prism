<template>
  <pre>
    <code>{{ codeResponse }}</code>
  </pre>
</template>

<script setup lang="ts">
const { data: codeResponse } = await useFetch("/api/pets");
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
}

html {
  font-family: sans-serif;
}

body {
  padding: 1.5rem;
}

pre {
  background-color: #eee;
  padding: 1.5rem;
}
</style>
