
  let current_model;
  let videoStreaming;
  let ar_btn;
  let opti_alu, opti_wh, opti_bk, lens_alu, lens_wh, lens_bk;
  let animationOpen = false;
  let video;
  let progressBar;
  let updatingBar;
  let modelViewer;

document.addEventListener("DOMContentLoaded", function() {
  modelViewer = document.querySelector( 'model-viewer' );
  if(!modelViewer) {
    console.log("Model-viewer can't be loaded"); // error message
    return true;
  }

  video = document.createElement("video");
  video.setAttribute('playsinline', true);
  video.setAttribute('autoplay', '');
  video.setAttribute('muted', '');
  videoStreaming = false;

  ar_btn = document.createElement("button");

  opti_alu = './assets/models/8800opti-al_anim.gltf';
  opti_wh = './assets/models/8800opti-wh_anim.gltf';
  opti_bk = './assets/models/8800opti-bk_anim.gltf';
  lens_alu = './assets/models/8800lens-alu_anim.gltf';
  lens_wh = './assets/models/8800lens-wh_anim.gltf';
  lens_bk = './assets/models/8800lens-bk_anim.gltf';

  current_model = opti_bk;
  if(!current_model) {
    console.log("Current model can't be loaded"); // error message
    return true;
  }

  modelViewer.src = current_model;

  // Handles loading the events for <model-viewer>'s slotted progress bar
  const onProgress = (event) => {
    progressBar = event.target.querySelector('.progress-bar');
    updatingBar = event.target.querySelector('.update-bar');
    updatingBar.style.width = `${event.detail.totalProgress * 100}%`;
    if ( event.detail.totalProgress === 1) {
      progressBar.classList.add('hide');
    } else {
      progressBar.classList.remove('hide');
    }
  };
  modelViewer.addEventListener('progress', onProgress);
});

// Handles the button to play and reverse animation and stop it at the last/first frame
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

// Check if the user device has a camera. If so, create an "AR" button to allow camera stream
function detectWebcam(callback) {
  let md = navigator.mediaDevices;
  if (!md || !md.enumerateDevices) return callback(false);
  md.enumerateDevices().then(devices => {
    callback(devices.some(device => 'videoinput' === device.kind));
  })
}

detectWebcam(function(hasWebcam) {
  console.log('Webcam: ' + (hasWebcam ? 'yes' : 'no'));
  if (hasWebcam) {
    ar_btn.setAttribute('id', 'ar_btn');
    ar_btn.setAttribute('class', 'button');
    ar_btn.setAttribute('onclick', 'cameraStream()');
    modelViewer.appendChild(ar_btn);
  }
})

// Function to grab camera stream and set it instead of the background. (Turns stream on/off)
function cameraStream() {
  navigator.mediaDevices.getMedia = (navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
  if(!videoStreaming && navigator.mediaDevices.getMedia != null){
    navigator.mediaDevices.getMedia({
      audio: false,
      video: {facingMode: 'environment'}
    })
    .then(stream => {
      window.localStream = stream;
      video.srcObject = stream;
      video.play();
      document.body.appendChild(video);
      videoStreaming = true;
      modelViewer.removeAttribute('auto-rotate');
    })
    .catch((err) => {
      console.log(err);
    });
 }

 else if(videoStreaming) {
   localStream.getVideoTracks()[0].stop();
   video.src = '';
   video.remove();
   videoStreaming = false;
   modelViewer.setAttribute('auto-rotate','true');
 }
};

// Color option buttons currently set to replace models completely while preserving the selection of optics.
function changeToWhite() {
  if(current_model == opti_bk || current_model == opti_alu || current_model == opti_wh)
  {
    current_model = opti_wh;
  }
  else if(current_model == lens_bk || current_model == lens_alu || current_model == lens_wh)
  {
    current_model = lens_wh;
  }
  modelViewer.src = current_model;
}

function changeToBlack() {
  if(current_model == opti_bk || current_model == opti_alu || current_model == opti_wh)
  {
    current_model = opti_bk;
  }
  else if(current_model == lens_bk || current_model == lens_alu || current_model == lens_wh)
  {
    current_model = lens_bk;
  }
  modelViewer.src = current_model;
}

function changeToAlu() {
  if(current_model == opti_bk || current_model == opti_alu || current_model == opti_wh)
  {
    current_model = opti_alu;
  }
  else if(current_model == lens_bk || current_model == lens_alu || current_model == lens_wh)
  {
    current_model = lens_alu;
  }
  modelViewer.src = current_model;
}

// Optics option buttons currently set to replace models completely while preserving the selection of colour.
function changeToOptilux() {
  if(current_model == opti_bk || current_model == lens_bk)
  {
    current_model = opti_bk;
  }
  else if(current_model == opti_alu || current_model == lens_alu)
  {
    current_model = opti_alu;
  }
  else if(current_model == opti_wh || current_model == lens_wh)
  {
    current_model = opti_wh;
  }
  modelViewer.src = current_model;
}

function changeToLens() {
  if(current_model == opti_bk || current_model == lens_bk)
  {
    current_model = lens_bk;
  }
  else if(current_model == opti_alu || current_model == lens_alu)
  {
    current_model = lens_alu;
  }
  else if(current_model == opti_wh || current_model == lens_wh)
  {
    current_model = lens_wh;
  }
  modelViewer.src = current_model;
}

// Hamburger menu open/close setting defined CSS properties.
function openNav() {
  document.getElementById("mySidenav").classList.add("sidenav-open");
}

function closeNav() {
  document.getElementById("mySidenav").classList.remove("sidenav-open");
}
