
let currentModel
let opti, lens;
let videoStreaming;
let arBtn;
let action_btns;
let animationOpen = false;
let video;
let progressBar, updatingBar;
let modelViewer;
let material, materialColor;
let currentColor = "black";
let optics = "opti";
let sideNav, menuShield, hamburger;
let currentFOV;

document.addEventListener( "DOMContentLoaded", function () {
  modelViewer = document.querySelector( 'model-viewer' );
  if( !modelViewer ) {
    console.log( "Model-viewer can't be loaded" ); // error message
    return true;
  }

// Parameters for the camera feed
  video = document.createElement( "video" );
  video.setAttribute( 'playsinline', true );
  video.setAttribute( 'autoplay', '' );
  video.setAttribute( 'muted', '' );
  videoStreaming = false;

  arBtn = document.createElement( "button" );
  action_btns = document.getElementById( "actionButtons" );
  menuShield = document.getElementById( 'shieldButtons' );
  sideNav = document.getElementById( 'mySidenav' );
  hamburger = document.getElementById( 'hamburger' );

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
    arBtn.setAttribute( 'id', 'ar_btn' );
    arBtn.setAttribute( 'class', 'button' );
    arBtn.setAttribute( 'onclick', 'cameraStream()' );
    action_btns.appendChild( arBtn );
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
// switching colors of the selected elements
function changeToAlu() {
  currentColor = "alu";
  changeColor();
}

function changeToWhite() {
  currentColor = "white";
  changeColor();
}

function changeToBlack() {
  currentColor = "black";
  changeColor();
}

function changeColor() {
  assignParts();
  if( currentColor == "alu" ) {
    profileMatColor.setBaseColorFactor( [0.28, 0.28, 0.28, 1] );
    profileMatColor.setMetallicFactor( 0.7 );
    profileMatColor.setRoughnessFactor( 0.99 );
  }
  else if ( currentColor == "white" ) {
    profileMatColor.setBaseColorFactor( [0.8, 0.8, 0.8, 1] );
    profileMatColor.setMetallicFactor( 0.2 );
    profileMatColor.setRoughnessFactor( 0.99 );
    if(currentModel = opti) {
      shieldToWhite();
    }
  }
  else if ( currentColor == "black" ) {
    profileMatColor.setBaseColorFactor( [0.01, 0.01, 0.01, 1] );
    profileMatColor.setMetallicFactor( 0.2 );
    profileMatColor.setRoughnessFactor( 1.0 );
    if( currentModel = opti ) {
      shieldToBlack();
    }
  }
}

function shieldToWhite() {
  assignShield();
  shieldMatColor.setBaseColorFactor( [0.8, 0.8, 0.8, 1] );
}

function shieldToBlack() {
  assignShield();
  shieldMatColor.setBaseColorFactor( [0.01, 0.01, 0.01, 1] );
}

//  picking the elements of the model that will be changed by index (done manually to be redone)
function assignParts() {
  if ( optics == "opti" ) {
    profileMat = modelViewer.model.materials[0]
  }
  else if ( optics == "lens" ) {
    profileMat = modelViewer.model.materials[26]
  }
  profileMatColor = profileMat.pbrMetallicRoughness;

}

//  finding shield
function assignShield() {
  shieldMat = modelViewer.model.materials[1];
  shieldMatColor = shieldMat.pbrMetallicRoughness;
  return shieldMatColor;
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
  sideNav.classList.add( "sidenav-open" );
  hamburger.style.display = 'none';
}

function closeNav() {
  sideNav.classList.remove( "sidenav-open" );
  hamburger.style.display = 'block';
}

// Closing the side menu when clicked outside
document.addEventListener( 'pointerdown', function handleClickDownOutsideNav( event ) {
  event.preventDefault();
  currentFOV = modelViewer.getFieldOfView();
  if (( !sideNav.contains( event.target )) && ( !hamburger.contains( event.target ))) {
    closeNav();
    modelViewer.FieldOfView = currentFOV;
  }
});

document.addEventListener( 'pointerup', function handleClickUpOutsideNav( event ) {
  event.preventDefault();
  modelViewer.FieldOfView = currentFOV;
});
