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
  if(!videoStreaming){
    navigator.mediaDevices.getMedia({
      audio: false,
      video: {facingMode: 'environment'}
    })
    .then(stream => {
      video.setAttribute('playsinline', true);
      video.setAttribute('autoplay', '');
      video.setAttribute('muted', '');
      //video.setAttribute('controls', true);
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





// function cameraStream() {
//   // navigator.mediaDevices.getMedia = (navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
//     if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//       navigator.mediaDevices.getUserMedia({
//         audio: false,
//         video: {facingMode: 'environment'},
//         //video: true,
//       }).then((stream) => {
//         //stream.getVideoTracks()[0].onended = () => console.log("ended");
//         if(!videoStreaming) {
//           video.setAttribute('playsinline', true);
//           video.setAttribute('autoplay', '');
//           video.setAttribute('muted', '');
//           //video.setAttribute('controls', true);
//           video.srcObject = stream;
//           video.play();
//           document.body.appendChild(video);
//           videoStreaming = true;
//         }
//
//         else if(videoStreaming) {
//           stream.getVideoTracks().forEach(function(track) {
//             track.stop();
//           });
//           video.srcObject = null;
//           video.remove();
//           videoStreaming = false;
//         }
//       })
//     }
//      else {
//        console.log ("navigator.mediaDevices not supported");
//      }
// }
