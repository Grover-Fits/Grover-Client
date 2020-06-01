<template>
    <md-dialog v-if="isClicked" class="uploadMore" :md-active.sync="isClicked">
        <md-dialog-title>Upload Files</md-dialog-title>
        <large v-on:grabIngestedFiles="storeIngestedFiles" />
    </md-dialog>
</template>


<script>
    import large from './large.vue'
    import 'vue-material/dist/vue-material.min.css'
    import 'vue-material/dist/theme/default.css'
    
    export default {
        name: 'dialogBox',
        data () {
            return {
                uploadedFiles: [],
                uploadError: null,
                clickedStatus: false,
                currentStatus: null,
            }
        },
        props: {
            showD: {
                type: Boolean
            }
        },
        watch: { 
            showD: {
                immediate: true,
                handler(val) {
                    console.log("NEW DIALOG SHOWN!", val)
                }
            }
        },
        components: {
            large
        },
        created() {
            
        },
        computed: {
            isClicked() {
                console.log("INSIDE CHECK CLICKED")
                return this.showD
            }
        },
        mounted() {
            
        },
        methods: {
        }
    }

</script>