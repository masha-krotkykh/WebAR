const modelViewer = document.querySelector( 'model-viewer' );
let animationOpen = false;
const video = document.createElement("video");
video.setAttribute('playsinline', true);
video.setAttribute('autoplay', '');
video.setAttribute('muted', '');
// video.setAttribute('controls', true);
let videoStreaming = false;

// Handles loading the events for <model-viewer>'s slotted progress bar
const onProgress = (event) => {
  const progressBar = event.target.querySelector('.progress-bar');
  const updatingBar = event.target.querySelector('.update-bar');
  updatingBar.style.width = `${event.detail.totalProgress * 100}%`;
  if (event.detail.totalProgress === 1) {
    progressBar.classList.add('hide');
  } else {
    progressBar.classList.remove('hide');
  }
};

modelViewer.addEventListener('progress', onProgress);

function playAnimation() {
  if(!animationOpen) {
    modelViewer.timeScale = 0.7;
    modelViewer.play({repetitions: 1});
    animationOpen = true;
  }

  else {
    modelViewer.timeScale = -0.7;
    modelViewer.play({repetitions: 1});
    animationOpen = false;
  }
}

function cameraStream() {

  navigator.mediaDevices.getMedia = (navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
  if(!videoStreaming){
    navigator.mediaDevices.getMedia({
      audio: false,
      video: {facingMode: 'environment'}
    })
    .then(stream => {
      window.localStream = stream;
      video.srcObject = stream;
      video.play();
      document.body.appendChild(video);
    })
    .catch((err) => {
      console.log(err);
    });
 }

 else if(videoStreaming) {
   localStream.getVideoTracks()[0].stop();
   video.src = '';
   video.remove();
 }
 videoStreaming = !videoStreaming;
};

console.log(modelViewer);
