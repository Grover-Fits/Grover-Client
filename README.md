# Grover-Client - Fits Image Extractor

Grover allows you to visualize your fits image files as well as provide the metadata contained within each file: 
- Visualize and store fits files + images
- Convert extracted images to videos and mosiacs
- View metadata extracted from file

### Usage
***
**STARTING THE CLIENT**
***

**Using express webserver(for development / testing)**
```bash
    make start-dev
```

**Using production with [Grover-Server](https://github.com/Grover-Fits/grover-server)**
```bash
    make build-production
```
* The production directory will be under ./grover/dist
* You may move the folder and its contents to any location you chose

#### Known Issues
* Handling of fits file images with floating point bitpix value (-32, -64) renders a insufficient image. For now use fits files with only integer based bitpix values
* Large fits file handling crashes the client

***
## Contributing
[Contributions](https://github.com/Grover-Fits/grover-client/issues?q=is%3Aissue+is%3Aopen) are welcome. If interested, fork this repo and submit a PR.

***
### TODO:
* docker image
* ~~clean up UI~~