console.log('init');

new Soundkit();


let recordButton, stopButton, recorder, audioList, bps, stream;

window.onload = function () {
    recordButton = document.getElementsByClassName('record')[0];
    stopButton = document.getElementsByClassName('stop')[0];
    audioList = document.getElementsByClassName('audio-list')[0];
    bps = document.getElementsByClassName('bps')[0];
    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
    }).then(function (streamObj) {
        recordButton.disabled = false;
        recordButton.addEventListener('click', startRecording);
        stopButton.addEventListener('click', stopRecording);
        stream = streamObj;
    });
};

function startRecording() {
    recorder = new MediaRecorder(stream, {audioBitsPerSecond: bps.value});
    recorder.addEventListener('dataavailable', onRecordingReady);
    recordButton.disabled = true;
    stopButton.disabled = false;

    recorder.start();
}

function stopRecording() {
    recordButton.disabled = false;
    stopButton.disabled = true;
    recorder.stop();
}

function onRecordingReady(e) {
    let audio = document.createElement('audio');
    audio.controls = true;
    audio.src = URL.createObjectURL(e.data);
    audioList.appendChild(audio);
}
