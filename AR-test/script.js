const modelViewer = document.querySelector( 'model-viewer' );
let animationOpen = false;
const video = document.createElement("video");

// Handles loading the events for <model-viewer>'s slotted progress bar
const onProgress = (event) => {
  const progressBar = event.target.querySelector('.progress-bar');
  const updatingBar = event.target.querySelector('.update-bar');
  updatingBar.style.width = `${event.detail.totalProgress * 100}%`;
  if (event.detail.totalProgress === 1) {
    progressBar.classList.add('hide');
  } else {
    progressBar.classList.remove('hide');
    // if (event.detail.totalProgress === 0) {
    //   event.target.querySelector('.center-pre-prompt').classList.add('hide');
    // }
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


  cameraStream();
}

function cameraStream() {
  navigator.mediaDevices.getUserMedia({video: true}).then((stream) => {
    video.srcObject = stream;
    video.play();
  });
  document.body.appendChild(video);
}
