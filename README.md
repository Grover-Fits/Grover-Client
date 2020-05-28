# Grover-Server - Fits Image Extractor

Grover allows you to visualize your fits image files as well as provide the metadata contained within each file: 
- Visualize and store fits files + images
- View metadata extracted from file
- Convert extracted images to a video file(.mkv)

### Usage
***
**STARTING THE CLIENT**
***
**Make sure you have golang >v1.14**  

**Using python webserver(for development / testing)**
```bash
    make start
```

**Using production webserver(nginx, apache, caddy, etc)**
* clone repo into webroot
* update *.conf files needed to show client in browser

You can access the site from http://localhost:8085
***
#### TODO:
* docker image
* clean up UI