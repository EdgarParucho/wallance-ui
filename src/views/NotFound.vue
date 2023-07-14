<template>
  <div class="mt-18">
    <h1>Oops!</h1>
    <h3>The {{ resource }} you're looking for is not here.</h3>
    <router-link class="text-indigo-400" :to="{ name: 'Dashboard' }">Back to the home page</router-link>
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