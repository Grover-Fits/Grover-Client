<template>
<div id="main-content">
<div id="image"></div>
<md-progress-spinner v-if="isSaving" md-mode="indeterminate"></md-progress-spinner>
    <form v-if="isInitial || isSaving">
        <input type="file" ref="fitsFiles" multiple @change="readFile" :disabled="isSaving" accept=".fits">
        <h4 v-if="isInitial">Fits File Extractor</h4>
        <p v-if="isInitial">Drag your files(s) here or click in this area.</p>
    </form>
</div>
</template>

<script>
    import axios from 'axios'
    import {eventBus} from "../main.js";
    import 'vue-material/dist/vue-material.min.css'
    import 'vue-material/dist/theme/default.css'
    const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3;
    export default {
        name: 'large',
        data () {
            return {
                uploadedFiles: [],
                uploadError: null,
                currentStatus: null,
            }
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
        created() {
            eventBus.$on('updateShown', (fileLocation) => {
                this.updateShownImage(fileLocation);
            })
        },
        mounted() {
                this.currentStatus = STATUS_INITIAL;
                this.uploadedFiles = [];
                this.uploadError = null;
        },
        methods: {
            updateList() {
            },
            readFile() {
                for (let i = 0; i < this.$refs.fitsFiles.files.length; i++) {
                    let file = this.$refs.fitsFiles.files[i];

                    let reader = new FileReader();
                    
                    reader.onload = (evt) => {
                        let res = evt.target.result;
                        this.sendFile(res, file.name);
                        console.log("Found File:", file.name);
                    };

                    reader.onerror = function() {
                        console.log(reader.error);
                    };
                    reader.readAsBinaryString(file)
                    
                }
            },
            checkLoaded() {
                if (document.getElementById('currImg').src) {
                    this.currentStatus = STATUS_SUCCESS;
                    this.$emit('grabIngestedFiles', this.uploadedFiles)
                } else {
                    setTimeout(this.checkLoaded(), 15);
                }
            },
            updateShownImage(fileLocation) {
                document.getElementById("currImg").src = fileLocation;
            },
            async sendFile(output, fn) {
                this.currentStatus = STATUS_SAVING;
                output = btoa(unescape(output))
                try {
                    let body = `{"name": "${fn}", "fileContent": "${output}"}`;
                    let config = {
                        headers: {
                           "Content-Type" : "application/json",
                        }
                    }
                    let resp = await axios.post('http://localhost:8081/api/fits/upload', body, config);
                    let {metadata} = resp.data
                    let details = JSON.parse(metadata);
                    console.log("DETAILS: ", details.Images[0]);
                    this.uploadedFiles.push(details);

                    // console.log("starting to generate image");
                    if(document.body.contains(document.getElementById('currImg'))){
                            this.updateShownImage(details.Images[0]);
                    } else{
                        let elem = document.createElement("img");
                        elem.id = "currImg";
                        elem.src = details.Images[0];
                        document.getElementById("image").appendChild(elem);
                        eventBus.$emit('updateMeta', details.Metas[0]);
                        this.checkLoaded()
                    }
                    

                } catch(err) {
                    console.log(err)
                }




                // let xhr = new XMLHttpRequest();
                // xhr.open('POST', 'http://localhost:8081/api/fits/upload');
                // xhr.setRequestHeader("Content-Type", "application/json");
                // xhr.onreadystatechange = () => {
                //     if(xhr.readyState == 4 && xhr.status == 200) {
                //         this.currentStatus = STATUS_SUCCESS;
                //         let resp = JSON.parse(xhr.responseText);
                //         let {metadata} = resp;
                //         let details = JSON.parse(metadata);
                //         console.log("imge generated", details)

                //         // let upComplete = document.getElementById(`uploadStatus_${fn}`);
                //         // upComplete.setAttribute("imgLoc", `"${details.Image}"`)
                //         // upComplete.setAttribute("metaLoc", `"${details.Meta}"`)
                //         // let args = `'${details.Image}', '${details.Meta}', '${fn}'`
                //         // upComplete.innerHTML = `<a href="#" onclick="changeInfo(${args});">${fn} &#9989</a>`;

                //         if(document.body.contains(document.getElementById('currImg'))){
                //             // changeInfo(details.Image, details.Meta);
                //         } else{
                //             // console.log("starting to generate image");
                //             // let elem = document.createElement("img");
                //             // elem.id = "currImg";
                //             // elem.src = details.Images[0];
                //             // document.getElementById("image").appendChild(elem);
                            
                //             // let metaElm = document.createElement("object");
                //             // metaElm.id = "currMeta"
                //             // metaElm.data = details.Metas[0];
                //             // document.getElementById("metadata").appendChild(metaElm);
                //             // loadMeta(details.Meta)
                //         }
                //     }
                // }
                // console.log("preparing to send . . .")
                // xhr.send(json);
            }
        }
    }

</script>