<template>
  <div id="app">
    <header>
      <h1>Grover - Fits File Extractor</h1>
    </header>
    <main>
      <aside class="sidebar">
        <ingestmeta v-bind:ingestedFiles="this.ingestedFiles"/>
      </aside>
      <div class="content">
        <large v-on:grabIngestedFiles="storeIngestedFiles"/>
      </div>
    </main>
  </div>
</template>

<script>
  import large from './components/large.vue'
  import ingestmeta from './components/ingestmeta.vue'

  export default {
    name: 'App',
    data () {
      return {
        ingestedFiles: []
      }
    },
    components: {
      large,
      ingestmeta
    },
    methods: {
      storeIngestedFiles(value)  {
        this.ingestedFiles = value
        console.log("Received from large:", this.ingestedFiles)
      }
    }
  }
</script>


