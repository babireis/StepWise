const electron = require('electron')
    app = electron.remote.app,
    screen=electron.screen,
    ioHook = require('iohook'),
    fs = require('fs'),
    path = require('path')
    screenshot = require('desktop-screenshot')
    const {shell} = require('electron');

//console.log(screen.getPrimaryDisplay().bounds.width);

//get the device width
var displayWidth=screen.getPrimaryDisplay().bounds.width;
var displayHeight=screen.getPrimaryDisplay().bounds.height;
//get current working directory
var basepath = app.getPath('pictures');
console.log(basepath);
//set global var for
var recordingState = 0;

//create a new folder for the scenario
var dir;
// Register and start hook
ioHook.start();

// ioHook.on('keydown', event => {
//   console.log(event); // { type: 'mousemove', x: 700, y: 400 }
// });

// ctrl+shift+s
const id = ioHook.registerShortcut([29, 42, 31], (keys) => {
    if (recordingState >= 1) {
        //console.log('Shortcut called with keys:', keys);
        captureScreenShot(recordingState);
        recordingState += 1;
    }
});


function captureScreenShot(index) {
    var imgName = "Step_"+index + ".png";
    screenshot(path.join(dir,imgName),{width: displayWidth, height: displayHeight}, function (error, complete) {
        if (error) {
            console.log("Screenshot failed", error);
            displaySnackBar("Fail to record");
        }
        else {
            console.log("Screenshot succeeded");
            displaySnackBar("Recorded");
        }
    });
}

setDefaultScenarioName();

function setDefaultScenarioName() {
    var x = document.getElementById("scname");
    x.value = generateRandomName();
}

//generate a random scenarion name
function generateRandomName() {
    //var num = Math.floor((Math.random() * 100000) + 1);
    var d = new Date();
    dateString = d.getUTCFullYear() + "" + (d.getUTCMonth() + 1) + "" + d.getUTCDate() + "_" + d.getUTCHours() + "" + d.getUTCMinutes() + "" + d.getUTCSeconds() + "" + d.getUTCMilliseconds();
    console.log(dateString);
    return "stepwise" + dateString;
}

//start/stop recording
function startRecording() {
    console.log(recordingState);
    var x = document.getElementById("scname");
    if (x.value) {
        var recordBtn = document.getElementById("record");
        if (recordingState == 0) {
            recordBtn.innerHTML = "Stop Recording";
            dir = x.value;
            displaySnackBar("Recording Started");
            recordingState = 1;
            x.disabled = true;
            dir=path.join(basepath,x.value);
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
            }
            // const id = ioHook.registerShortcut([29, 65], (keys) => {
            //     console.log('Shortcut called with keys:', keys)
            // });
        } else {
            recordBtn.innerHTML = "Start Recording";
            recordingState = 0;
            x.disabled = false;
            setDefaultScenarioName();
            var status=document.getElementById("status");
            //status.innerHTML="Steps saved"+"<a href='#' onclick="+openInFolder(dir)+">here.</a>"
            status.innerText="Steps successfully saved at location "+path.join(dir);
            displaySnackBar("Recording Stopped");
        }
    } else {
        displaySnackBar("Please enter a valid scenario name");
    }

}

function openInFolder(folderPath){
    shell.showItemInFolder(folderPath);
}
//display snackbar
function displaySnackBar(msg = "Loading..", timeout = 3000) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");

    // Add the "show" class to DIV
    x.className = "show";
    x.innerHTML = msg;
    // After 3 seconds, remove the show class from DIV
    setTimeout(function () { x.className = x.className.replace("show", ""); }, timeout);
}