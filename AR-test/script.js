
let currentModel
let opti, lens;
let videoStreaming;
let ar_btn;
let animationOpen = false;
let video;
let progressBar;
let updatingBar;
let modelViewer;
let material, materialColor;
let currentColor = "black";
let optics = "opti";
let menuShield;

document.addEventListener( "DOMContentLoaded", function () {
  modelViewer = document.querySelector( 'model-viewer' );
  if( !modelViewer ) {
    console.log( "Model-viewer can't be loaded" ); // error message
    return true;
  }

  video = document.createElement( "video" );
  video.setAttribute( 'playsinline', true );
  video.setAttribute( 'autoplay', '' );
  video.setAttribute( 'muted', '' );
  videoStreaming = false;

  ar_btn = document.createElement( "button" );

  menuShield = document.getElementById( 'shieldButtons' );

  opti = './assets/models/8800opti.gltf';
  lens = './assets/models/8800lens.gltf';

  currentModel = opti;
  if( !currentModel ) {
    console.log( "Current model can't be loaded" ); // error message
    return true;
  }

  // Handles loading the events for <model-viewer>'s slotted progress bar
  const onProgress = ( event ) => {
    progressBar = event.target.querySelector( '.progress-bar' );
    updatingBar = event.target.querySelector( '.update-bar' );
    updatingBar.style.width = `${event.detail.totalProgress * 100}%`;
    if ( event.detail.totalProgress === 1 ) {
      progressBar.classList.add( 'hide' );
    } else {
      progressBar.classList.remove( 'hide' );
    }
  };
  modelViewer.addEventListener( 'progress', onProgress );
});


// Handles the button to play and reverse animation and stop it at the last/first frame
function playAnimation() {
  if( !animationOpen ) {
    modelViewer.timeScale = 0.7;
    modelViewer.play( { repetitions: 1 } );
    animationOpen = true;
  }
  else {
    modelViewer.timeScale = -0.7;
    modelViewer.play( { repetitions: 1 } );
    animationOpen = false;
  }
}

// Check if the user device has a camera. If so, create an "AR" button to allow camera stream
function detectWebcam( callback ) {
  let md = navigator.mediaDevices;
  if ( !md || !md.enumerateDevices ) return callback( false );
  md.enumerateDevices().then( devices => {
    callback( devices.some( device => 'videoinput' === device.kind ));
  })
}

detectWebcam( function( hasWebcam ) {
  console.log( 'Webcam: ' + ( hasWebcam ? 'yes' : 'no' ));
  if ( hasWebcam ) {
    ar_btn.setAttribute( 'id', 'ar_btn' );
    ar_btn.setAttribute( 'class', 'button' );
    ar_btn.setAttribute( 'onclick', 'cameraStream()' );
    modelViewer.appendChild( ar_btn );
  }
})

// Function to grab camera stream and set it instead of the background. (Turns stream on/off)
function cameraStream() {
  navigator.mediaDevices.getMedia = ( navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia );
  if( !videoStreaming && navigator.mediaDevices.getMedia != null ){
    navigator.mediaDevices.getMedia( {
      audio: false,
      video: { facingMode: 'environment' }
    } )
    .then(stream => {
      window.localStream = stream;
      video.srcObject = stream;
      video.play();
      document.body.appendChild( video );
      videoStreaming = true;
      modelViewer.removeAttribute( 'auto-rotate' );
    } )
    .catch( ( err) => {
      console.log( err );
    } );
 }

 else if( videoStreaming ) {
   localStream.getVideoTracks()[0].stop();
   video.src = '';
   video.remove();
   videoStreaming = false;
   modelViewer.setAttribute( 'auto-rotate','true' );
 }
};

// COLOR OPTION BUTTONS.

//  picking the elements of the model that will be chnged by index
function assignParts() {
  if ( optics == "opti" ) {
    profileMat = modelViewer.model.materials[0]
  }
  else if ( optics == "lens" ) {
    profileMat = modelViewer.model.materials[26]
  }
  profileMatColor = profileMat.pbrMetallicRoughness;
  return profileMatColor;
}

//  finding shield
function assignShield() {
  shieldMat = modelViewer.model.materials[1];
  shieldMatColor = shieldMat.pbrMetallicRoughness;
  return shieldMatColor;
}

// switching colors of the selected elements
function changeToAlu() {
  assignParts();
  profileMatColor.setBaseColorFactor( [0.28, 0.28, 0.28, 1] );
  profileMatColor.setMetallicFactor( 0.7 );
  profileMatColor.setRoughnessFactor( 0.99 );
  currentColor = "alu";
}

function changeToWhite() {
  assignParts();
  profileMatColor.setBaseColorFactor( [0.8, 0.8, 0.8, 1] );
  profileMatColor.setMetallicFactor( 0.2 );
  profileMatColor.setRoughnessFactor( 0.99 );

  if(currentModel = opti) {
    shieldToWhite();
  }
  currentColor = "white";
}

function changeToBlack() {
  assignParts();
  profileMatColor.setBaseColorFactor( [0.01, 0.01, 0.01, 1] );
  profileMatColor.setMetallicFactor( 0.2 );
  profileMatColor.setRoughnessFactor( 1.0 );

  if( currentModel = opti ) {
    shieldToBlack();
  }
  currentColor = "black";
}

function shieldToWhite() {
  assignShield();
  shieldMatColor.setBaseColorFactor( [0.8, 0.8, 0.8, 1] );
}

function shieldToBlack() {
  assignShield();
  shieldMatColor.setBaseColorFactor( [0.01, 0.01, 0.01, 1] );
}

// Optics option buttons currently set to replace models completely while preserving the selection of colour.
function changeToOptilux() {
  currentModel = opti;
  optics = "opti";
  modelViewer.src = currentModel;
  menuShield.style.display = 'block';
}

function changeToLens() {
  currentModel = lens;
  optics = "lens";
  modelViewer.src = currentModel;
  menuShield.style.display = 'none';
}

// Hamburger menu open/close setting defined CSS properties.
function openNav() {
  document.getElementById( "mySidenav" ).classList.add( "sidenav-open" );
}

function closeNav() {
  document.getElementById( "mySidenav" ).classList.remove( "sidenav-open" );
}
