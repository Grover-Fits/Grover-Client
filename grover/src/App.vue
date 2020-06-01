<template>
  <div id="app">
    <header>
      <h1>Grover - Fits File Extractor</h1>
    </header>
    <main>
      <dialogbox v-bind:showD="this.showD"/>
      <aside class="sidebar">
        <ingestmeta v-bind:ingestedFiles="this.ingestedFiles" v-on:showDialog="renderDialog"/>
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
  import dialogbox from './components/dialogbox.vue'

  export default {
    name: 'App',
    data () {
      return {
        ingestedFiles: [],
        showD: false,
      }
    },
    components: {
      large,
      ingestmeta,
      dialogbox
    },
    methods: {
      storeIngestedFiles(value)  {
        this.ingestedFiles = value
        console.log("Received from large:", this.ingestedFiles)
      },
      // currently not using this, but will in the future
      renderDialog(value)  {
        this.showD = value
        console.log("Showing Dialog:", this.showD)
      }
    }
  }
</script>


