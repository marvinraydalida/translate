let width;
let height;
let streaming = false;
let video = document.getElementById('video');
let canvas = document.getElementById('canvas');
let photo = document.getElementById('photo');
let startbutton = document.getElementById('startbutton');
const resultBox = document.getElementById('resultBox');
const container = document.querySelector('.camera');

navigator.mediaDevices.enumerateDevices()
    .then(function (devices) {
        devices.forEach(function (device) {
            if (device.kind !== 'audioinput' && device.kind !== 'audiooutput') {
                console.log(device.kind + ": " + device.label +
                    " id = " + device.deviceId);
                const neweBtn = document.createElement("button");
                container.append(neweBtn);
                container.lastElementChild.textContent = device.label;
                container.lastChild.setAttribute('id', device.deviceId);
                container.lastElementChild.addEventListener('click', (event) => {
                    getMedia(event.target.id);
                });
            }

        });
        getMedia();
    })
    .catch(function (err) {
        console.log(err.name + ": " + err.message);
    });


function getMedia(sourceID = null) {
    let constraints = {
        audio: false,
        video: {
            facingMode: {
                ideal: "environment"
            }
        }
    };

    if (sourceID !== null) {
        constraints.video = {
            deviceId: {
                exact: sourceID
            }
        }
    }

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
            console.dir(video)
            video.srcObject = stream;
            video.play();
        })
        .catch(function (err) {
            console.log("An error occurred: " + err);
        });
}

video.addEventListener('canplay', function (ev) {
    if (!streaming) {
        height = video.videoHeight;
        width = video.videoWidth;
        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
    }
});

startbutton.addEventListener('click', function (ev) {
    takepicture();
    ev.preventDefault();
});


function clearphoto() {
    let context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    let data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
}

function takepicture() {
    let context = canvas.getContext('2d');
    if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);

        let data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);
        recognize(data);
    } else {
        clearphoto();
    }
}


function recognize(URL) {
    Tesseract.recognize(URL, 'eng+kor+rus', { logger: m => console.log(m) }).then(function (result) {
        console.dir(result);
        resultBox.textContent = result.data.text;
    })
}


clearphoto();
