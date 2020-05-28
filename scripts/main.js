function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function sendFile(output, fn) {
  output = btoa(unescape(output))
  json = `{"name": \"${fn}\", "fileContent": \"${output}\"}`;
  let xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:8081/api/fits/upload');
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = () => {
    if(xhr.readyState == 4 && xhr.status == 200) {
      resp = JSON.parse(xhr.responseText);
      let {metadata} = resp;
      details = JSON.parse(metadata);

      let upComplete = document.getElementById(`uploadStatus_${fn}`);
      upComplete.setAttribute("imgLoc", `"${details.Image}"`)
      upComplete.setAttribute("metaLoc", `"${details.Meta}"`)
      let args = `'${details.Image}', '${details.Meta}', '${fn}'`
      upComplete.innerHTML = `<a href="#" onclick=\"changeInfo(${args});\">${fn} &#9989</a>`;

      if(document.body.contains(document.getElementById('currImg'))){
        changeInfo(details.Image, details.Meta);
      } else{
        let elem = document.createElement("img");
        elem.id = "currImg";
        elem.src = details.Image;
        document.getElementById("image").appendChild(elem);
        
        let metaElm = document.createElement("object");
        metaElm.id = "currMeta"
        metaElm.data = details.Meta;
        document.getElementById("metadata").appendChild(metaElm);
        // loadMeta(details.Meta)
      }
    }
  }
  console.log("preparing to send . . .")
  xhr.send(json);
}

function loadMeta(p) {
  console.log(p)
  var file = new XMLHttpRequest();
  file.open("GET", p, true);
  file.onreadystatechange = function() {
    if (file.readyState === 4) {  // Makes sure the document is ready to parse
      if (file.status === 200) {  // Makes sure it's found the file
        console.log("TESTING121212121")
        console.log(file.responseText)
        text = file.responseText;
        // document.getElementById("div1").innerHTML = text;
      }
    }
  }
}

function readFile(input) {
  for (let i = 0; i < input.files.length; i++) {
    let file = input.files[i];

    let reader = new FileReader();
    reader.readAsBinaryString(file)

    reader.onload = function() {
      let res = reader.result.toString();
      renderUpload(file.name);
      sendFile(res, file.name);
    };

    reader.onerror = function() {
      console.log(reader.error);
    };
  }
}

function createTable() {
  let newTable = document.createElement("table");
  newTable.className = "table table-striped table-dark";
  newTable.id = "uploadTable";
  let header = newTable.createTHead();
  let row = header.insertRow(0);
  let cell = row.insertCell(0);
  cell.innerHTML = "<b>Filename</b>";
  newTable.createTBody();
  let fupload = document.getElementById("fupload")
  fupload.insertBefore(newTable, fupload.childNodes[0]);
}

function generateMovie() {
  let imgs = "";
  let jsonStr = '{"filePath": "';
  let table = document.getElementById("uploadTable");
  // console.log("button pressed!")
  for (let i = 0, row; row = table.rows[i]; i++) {
    if (row.getAttribute("imgLoc")){
      imgs = imgs + "./client/" + row.getAttribute("imgLoc") + " "
    }
  }
  imgs = imgs.replace(/['"]+/g, '');
  // console.log(imgs);
  jsonStr = jsonStr + imgs + '"}'
  let xhr = new XMLHttpRequest();
  // console.log(jsonStr);
  xhr.open('POST', 'http://localhost:8081/api/fits/movie');
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = () => {
    if(xhr.readyState == 4 && xhr.status == 200) {
      // console.log("Received movie location from grpc: " + xhr.responseText);
      let resp = xhr.responseText;
      resp = JSON.parse(resp)
      let {movLoc} = resp;
      // console.log(movLoc)
      btn = document.getElementById("movieBtn");
      btn.parentNode.removeChild(btn);
      let downloadBtn = document.createElement("a");
      let fupload = document.getElementById("fupload");
      downloadBtn.className = "btn btn-primary"
      downloadBtn.id = "movieBtn"
      downloadBtn.href = movLoc
      downloadBtn.target = "_blank";
      downloadBtn.innerHTML = "Download Ready!"
      fupload.insertBefore(downloadBtn, fupload.childNodes[0]);
    }
  }
  // console.log("preparing to send . . .")
  xhr.send(jsonStr);
}

function generationChange() {
  btn = document.getElementById("movieBtn");
  btn.className = "btn btn-secondary"
  btn.disabled;
}

function generateButton() {
  fupload = document.getElementById("fupload");
  button = document.createElement("button");
  button.id = "movieBtn";
  button.className = "btn btn-primary";
  button.innerHTML = "Generate Movie From Images";
  button.onclick = () => {
    generationChange();
    generateMovie();
  }
  fupload.insertBefore(button, fupload.childNodes[0]);
}

async function renderUpload(fn) {
  let max = 100;
  let currval = 0;
  let cell = "";
  if (document.getElementById(`uploadStatus_${fn}`)) {
    alert (`File: ${fn} has already been processed . . . not processing this file`);
    return
  }
  if(document.body.contains(document.getElementById('uploadTable'))){
    let tab = document.getElementById("uploadTable");
    let tbody = tab.getElementsByTagName('tbody')[0];
    if (tab.rows.length > 1 && !document.getElementById("movieBtn")) {
      generateButton();
    }
    let row = tbody.insertRow(-1);
    row.id = `uploadStatus_${fn}`;
    cell = row.insertCell(0);
  } else {
    createTable()
    renderUpload(fn)
  }
  cell.innerHTML = `Uploading ${fn} <progress id="fileProgress_${fn}" value="${currval}" max="${max}"> </progress>`;
  let progress = document.getElementById(`fileProgress_${fn}`);
  while (currval < max) {
    await sleep(450);
    progress.value = currval + 20
    currval = progress.value
  }
}

function changeInfo(imgLoc, metaLoc) {
  console.log("Changing information!");
  let newImg = document.getElementById("currImg");
  let newMeta = document.getElementById("currMeta");

  newImg.src = imgLoc;
  newMeta.data = metaLoc;
}