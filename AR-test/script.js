const modelViewer = document.querySelector( 'model-viewer' );
let animationOpen = false;
const video = document.createElement("video");
video.setAttribute('playsinline', true);
video.setAttribute('autoplay', '');
video.setAttribute('muted', '');
// video.setAttribute('controls', true);
let videoStreaming = false;

// let ar_btn = document.getElementById( "ar_btn" );
let ar_btn = document.createElement("button");

let wht_btn = document.getElementById( "wht_btn" );
let blk_btn = document.getElementById( "blk_btn" );
let alu_btn = document.getElementById( "alu_btn" );

let opti_alu = './assets/models/8800opti-al_anim.gltf';
let opti_wh = './assets/models/8800opti-wh_anim.gltf';
let opti_bk = './assets/models/8800opti-bk_anim.gltf';
let lens_alu = './assets/models/8800lens-alu_anim.gltf';
let lens_wh = './assets/models/8800lens-wh_anim.gltf';
let lens_bk = './assets/models/8800lens-bk_anim.gltf';
let current_model = opti_bk;
modelViewer.src = current_model;

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
navigator.getUserMedia({
  video: true
}, () => {
  ar_btn.setAttribute('id', 'ar_btn');
  ar_btn.onclick = cameraStream();
  modelViewer.appendChild(ar_btn);

}, () => {
  console.log('no webcam')
});

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
