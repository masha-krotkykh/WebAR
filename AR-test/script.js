const modelViewer = document.querySelector( 'model-viewer' );
let animationOpen = false;
const video = document.createElement("video");
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
  navigator.mediaDevices.getMedia({
    audio: false,
    video: {facingMode: 'environment'},
    //video: true,
  }).then((stream) => {
    //stream.getVideoTracks()[0].onended = () => console.log("ended");
    if(!videoStreaming) {
      video.setAttribute('playsinline', true);
      video.srcObject = stream;
      video.play();
      document.body.appendChild(video);
      videoStreaming = true;
    }

    else if(videoStreaming) {
      stream.getVideoTracks()[0].stop();
      video.src = '';
      document.body.removeChild(video);
      videoStreaming = false;
    }
  })
}
