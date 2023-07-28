<template>
  <div class="mt-18 text-white text-center">
    <h1 class="text-8xl">404</h1>
    <h3 class="text-xl">The {{ resource }} you're looking for is not here.</h3>
    <router-link class="text-yellow-400 hover:text-yellow-300" :to="{ name: 'Dashboard' }">Back to the home page</router-link>
  </div>
</template>
<script>
export default {
  props: {
    resource: {
      type: String,
      required: true,
      default: 'page'
    }
  }
}
</script>