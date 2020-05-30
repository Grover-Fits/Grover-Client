<template>
<div id="meta-content">
    <ul>
      <li v-for="file in ingestedFiles" v-bind:key="file" v-on:click="updateCurr(file.Images[0], file.Metas[0])">{{ file.Filename }}</li>
    </ul>
    <div id="showingMeta">
    </div>
</div>
</template>

<script>
    // import axios from 'axios'
    import {eventBus} from "../main.js";
    import 'vue-material/dist/vue-material.min.css'
    import 'vue-material/dist/theme/default.css'
    const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3;
    export default {
        name: 'ingestmeta',
        props: {
            ingestedFiles: {
                type: Array
            }
        },
        watch: { 
            ingestedFiles: {
                immediate: true,
                handler(val) {
                    console.log("NEW VAL FOUND!", val)
                }
            }
        },
        created() {
            eventBus.$on('updateMeta', (metaLocation) => {
                this.updateMeta(metaLocation);
            })
        },
        computed: {
            isInitial() {
                return this.currentStatus === STATUS_INITIAL;
            },
            isSaving() {
                return this.currentStatus === STATUS_SAVING;
            },
            isSuccess() {
                return this.currentStatus === STATUS_SUCCESS;
            },
            isFailed() {
                return this.currentStatus === STATUS_FAILED;
            }
        },
        mounted() {
                this.currentStatus = STATUS_INITIAL;
        },
        methods: {
            updateCurr(fileLocation, metaLocation)  {
                this.updateImage(fileLocation);
                this.updateMeta(metaLocation);
            },
            updateImage(fileLocation) {
                let currImg = document.getElementById("currImg");
                if(currImg.getAttribute("src").localeCompare(fileLocation) == 0) {
                    console.log("No change needed")
                } else {
                    eventBus.$emit('updateShown', fileLocation)
                }
            },
            updateMetaShown(metaLocation) {
                document.getElementById("currMeta").data = metaLocation;
            },
            updateMeta(metaLocation) {
                if(document.body.contains(document.getElementById('currMeta'))){
                    this.updateMetaShown(metaLocation);
                } else{
                    let metaElm = document.createElement("object");
                    metaElm.id = "currMeta"
                    metaElm.data = metaLocation;
                    document.getElementById("showingMeta").appendChild(metaElm);
                }
            }
        }
    }

</script>