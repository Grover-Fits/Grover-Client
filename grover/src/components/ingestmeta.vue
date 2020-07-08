<template>
<div id="meta-content" v-if="ingestedFiles.length > 0">
    <md-button v-if="this.showMeta" class="md-fab md-mini md-primary metaBtn" @click="this.flipVisibleMeta">
        <md-icon v-if="!metaVisible">visibility</md-icon>
        <md-icon v-if="metaVisible">visibility_off</md-icon>
    </md-button>
    <md-list class="list-theme" :md-expand-single="expandSingle">
        <md-list-item md-expand v-for="file in ingestedFiles" v-bind:key="file">
            <span class="md-list-item-text">({{file.Images.length}}) {{ file.Filename }}</span>
            <md-list slot="md-expand">
                <md-list-item class="list-theme" v-for="(images, i) in file.Images" v-bind:key="images+'_'+i" v-on:click="updateCurr(images, file.Metas[0])">
                    {{ images }}
                </md-list-item>
            </md-list>
            <md-divider></md-divider>
        </md-list-item>
    </md-list>
    <div id="showingMeta" v-if="this.metaVisible">
    </div>
    <div>
    <!--<md-button v-if="isMosAvailable" class="md-raised md-primary mosaicBtn" @click="generateMosaic"> -->
    <md-button v-if="isMosAvailable || isAvailable || isDone || isMosDone" class="md-raised md-primary mosaicBtn" @click="showDialog = true">
            Generate Outputs
    </md-button>
    <md-dialog :md-active.sync="showDialog">
        <md-dialog-title>
            Generate Mosaic
            <md-button v-if="isDone || isMosDone" class="md-fab md-mini md-primary refreshBtn" @click="updateAvailable">
                <md-icon>refresh</md-icon>
            </md-button>
        </md-dialog-title>
        <md-dialog-content>
        <md-table v-model="allImages" md-sort="name" md-sort-order="asc" @md-selected="onSelect" md-card>
                <md-table-row slot="md-table-row" slot-scope="{ item }" md-selectable="multiple" md-auto-select>
                    <md-table-cell md-label="Image" md-sort-by="name">{{item.name}}<img v-bind:src="item.name" id="imgPreview"/></md-table-cell>
                </md-table-row>
        </md-table>
        <md-button v-if="isAvailable" class="md-raised md-primary" @click="generateMovie">
            Generate Movie
        </md-button>
        <md-button v-if="isMosAvailable" class="md-raised md-primary mosaicBtn" @click="generateMosaic">
            Generate Mosaic
        </md-button>
        <md-progress-spinner v-if="isCreating" md-mode="indeterminate" :md-diameter="30" :md-stroke="3" class="metaLoading"></md-progress-spinner>
        <a id="downloadBtn" v-bind:href="this.movieDownloadLocation" target="_blank" v-if="isDone">
            <md-button class="md-raised md-primary">
                <md-icon>cloud_download</md-icon>
            </md-button>
        </a>
        <md-progress-spinner v-if="isMosCreating" md-mode="indeterminate" :md-diameter="30" :md-stroke="3" class="metaSpinner"></md-progress-spinner>
        <a class="mosaicBtn" v-bind:href="this.mosaicDownloadLocation" target="_blank" v-if="isMosDone">
            <md-button class="md-raised md-primary">
                <md-icon>cloud_download</md-icon>
            </md-button>
        </a>
        </md-dialog-content>
    </md-dialog>
    <!-- <md-button class="md-raised md-primary uploadBtn" @click="renderDialog">
            Upload more files
    </md-button> -->
    </div>
</div>
</template>


<script>
    import axios from 'axios'
    import {eventBus} from "../main.js";
    import 'vue-material/dist/vue-material.min.css'
    import 'vue-material/dist/theme/default.css'
    const STATUS_INITIAL = 0, STATUS_MOVIE_AVAIL = 1, STATUS_MOVIE_CREATING = 2, STATUS_MOVIE_DONE = 3, STATUS_MOSAIC_CREATING = 4, STATUS_MOSAIC_DONE = 5, STATUS_MOSAIC_AVIL = 6;
    export default {
        name: 'ingestmeta',
        data () {
            return {
                selected: [],
                mosaicOrder: [],
                allImages: [],
                currentStatus: null,
                currentMosStatus: null,
                currentMeta: null,
                currentShow: null,
                showMeta: false,
                metaVisible: false,
                expandSingle: true,
                showDialog: false,
                movieDownloadLocation: null,
                mosaicDownloadLocation: null
            }
        },
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
                    this.allImages = [];
                    let count = 0;
                    for (let i = 0; i < val.length; i++) {
                        count += val[i].Images.length
                        for (let j = 0; j < val[i].Images.length; j++) {
                            this.allImages.push({"name": val[i].Images[j]});
                        }
                    }

                    if (count > 1) {
                        this.currentStatus = STATUS_MOVIE_AVAIL;
                        this.currentMosStatus = STATUS_MOSAIC_AVIL;
                        console.log("ENOUGH IMAGES FOUND!")
                        console.log("allimages:", this.allImages)
                    }
                    if (val.length >= 1) {
                        this.showMeta = true
                    }
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
            isAvailable() {
                return this.currentStatus === STATUS_MOVIE_AVAIL;
            },
            isCreating() {
                return this.currentStatus === STATUS_MOVIE_CREATING;
            },
            isDone() {
                return this.currentStatus === STATUS_MOVIE_DONE;
            },
            isMosAvailable() {
                return this.currentMosStatus === STATUS_MOSAIC_AVIL;
            },
            isMosCreating() {
                return this.currentMosStatus === STATUS_MOSAIC_CREATING;
            },
            isMosDone() {
                return this.currentMosStatus === STATUS_MOSAIC_DONE;
            }
        },
        mounted() {
                this.currentStatus = STATUS_INITIAL;
                this.currentMosStatus = STATUS_INITIAL;
        },
        methods: {
            onSelect (items) {
                this.selected = items
            },
            updateAvailable() {
                this.currentStatus = STATUS_MOVIE_AVAIL 
                this.currentMosStatus = STATUS_MOSAIC_AVIL
            },
            async generateMosaic() {
                console.log("selected values for mosaic:", this.selected)
                this.currentMosStatus = STATUS_MOSAIC_CREATING;
                try {
                    let count = 0;
                    let body = `{"filePath": "`;
                    let imgStr = '';
                    for (let i = 0; i < this.selected.length; i++) {
                        imgStr = imgStr + this.selected[i].name + " "
                        count ++;
                    }
                    console.log(count)
                    imgStr = imgStr.replace(/['"]+/g, '');
                    body = body + imgStr + `", "count": "${count}"}`
                    let config = {
                        headers: {
                           "Content-Type" : "application/json",
                        }
                    }
                    let resp = await axios.post('http://localhost:8080/api/fits/mosaic', body, config);
                    console.log("Received response:", resp)
                    this.currentMosStatus = STATUS_MOSAIC_DONE;
                    this.mosaicDownloadLocation = resp.data.mosLoc
                } catch(err) {
                    console.log(err)
                }
            },
            async generateMovie() {
                this.currentStatus = STATUS_MOVIE_CREATING;
                try {
                    let body = `{"filePath": "`;
                    let imgStr = '';
                    for (let i = 0; i < this.selected.length; i++) {
                        imgStr = imgStr + this.selected[i].name + " "
                    }
                    imgStr = imgStr.replace(/['"]+/g, '');
                    body = body + imgStr + '"}'
                    let config = {
                        headers: {
                           "Content-Type" : "application/json",
                        }
                    }
                    let resp = await axios.post('http://localhost:8080/api/fits/movie', body, config);
                    console.log("Received response:", resp)
                    this.currentStatus = STATUS_MOVIE_DONE
                    this.movieDownloadLocation = resp.data.movLoc
                } catch(err) {
                    console.log(err)
                }
            },
            updateCurr(fileLocation, metaLocation)  {
                if (fileLocation != null) {
                    this.updateImage(fileLocation);
                }
                if (metaLocation != null) {
                    this.updateMeta(metaLocation);
                }
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
                this.currentMeta = metaLocation
                if(document.body.contains(document.getElementById('currMeta'))){
                    this.updateMetaShown(metaLocation);
                } else if (document.body.contains(document.getElementById('showingMeta'))){
                    let metaElm = document.createElement("object");
                    metaElm.id = "currMeta"
                    metaElm.data = metaLocation;
                    document.getElementById("showingMeta").appendChild(metaElm);
                }
            },
            flipVisibleMeta() {
                this.metaVisible = !this.metaVisible
                console.log("CURRENT META SELECTED:", this.currentMeta)
                if (this.metaVisible) {
                    this.$nextTick(() => {
                        this.updateMeta(this.currentMeta)  
                    })
                }
            }
        }
    }

</script>