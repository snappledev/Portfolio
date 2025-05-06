var screenW = 1180
var screenH = 810;

var screenOverlay, screenMaterial;
var isScreenActive = false;
var isZooming = false;
var currentStage = "computer";
var powerOn = false;
var bootProgress = 0;
var bootText = "> INITIALISING HIDDEN LAYERS ...\n> TRAINING WEIGHTS AND BIASES...\n> PASSING TESTING DATA...";
var nodeInfoElements = [];
var hoveredNode = null;

function loadcomputer() {
    const loader = new THREE.GLTFLoader();
    loader.load('./assets/Computer Model two.glb', function (gltf) {
        computerModel = gltf.scene;
        
        computerModel.position.set(0, 0, 0);
        computerModel.rotation.y;
        computerModel.scale.set(2, 2, 2);


        const screenGeometry = new THREE.PlaneGeometry(screenW/500, screenH/500);
        screenMaterial = new THREE.MeshBasicMaterial({transparent: true, opacity: 1, side: THREE.DoubleSide});
        //mixer = new THREE.AnimationMixer(gltf.scene);
        //const animations = gltf.animations;
        //animations.forEach(clip => {
        //    const action = mixer.clipAction(clip);
        //    actions.push(action);
        //    console.log("Pushed animation")
        //});
        screenOverlay = new THREE.Mesh(screenGeometry, screenMaterial);
        screenOverlay.position.copy(new THREE.Vector3(0, 1.95, 0.5));
        screenOverlay.rotation.copy(new THREE.Euler(0, 0, 0));
        computerModel.add(screenOverlay);
        
        computerGroup.add(computerModel);
        poweroffThaScreen();
    }, undefined, console.error);
}
  

function readyscreen() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = screenW;
    canvas.height = screenH;
  
    
    ctx.fillStyle = '#001100';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  //////////////////////////////////////////
    ctx.fillStyle = 'rgba(0,255,0,0.08)';
    for(let y = 0; y < canvas.height; y += 3) {

        ctx.fillRect(0, y, canvas.width, 1);

    }
  ///////////////////////////////
    ctx.font = '40px consolas';
    ctx.fillStyle = '#00ff00';
    bootText.split('\n').forEach((line, i) => {

        ctx.fillText(line, 30, 50 + (i * 50));
        
    });
  
    const buttonWidth = 330;
    const buttonHeight = 70;
    const buttonX = (canvas.width - buttonWidth)/2;
    const buttonY = canvas.height - 100;


    ///////////////////////////////////////////
    ctx.fillStyle = '#002200';
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
   //////////////////////////
    ctx.fillStyle = '#00ff00';
    ctx.strokeRect(buttonX - 1, buttonY - 1, buttonWidth + 2, buttonHeight + 2);
    ctx.fillText('ENTER NETWORK', buttonX + 20, buttonY + 45);

  ////////////////////////////////////////////////////////////////////////


    screenMaterial.map = new THREE.CanvasTexture(canvas);
    screenMaterial.map.needsUpdate = true;
    screenMaterial.needsUpdate = true;
}
function poweroffThaScreen() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = screenW;
    canvas.height = screenH;
  
    ctx.fillStyle = '#001100';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#00ff00';
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2, 60, 0, Math.PI * 2);
    ctx.fill();
    /////////////////////////////////////////
    ctx.fillStyle = '#001100';
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2, 40, 0, Math.PI * 2);
    ctx.fill();
    screenMaterial.map = new THREE.CanvasTexture(canvas);
    screenMaterial.map.needsUpdate = true;
    screenMaterial.needsUpdate = true;
}
  
function render_powerupScreen() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = screenW;
    canvas.height = screenH;
    ctx.fillStyle = '#001100';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0,255,0,0.08)';
    for(let y = 0; y < canvas.height; y += 3) {
      ctx.fillRect(0, y, canvas.width, 1);
    }


    const lines = bootText.split('\n');
    const visibleText = lines.map(line => line.substring(0, bootProgress)).join('\n');
    ctx.font = '40px consolas';
    ctx.fillStyle = '#00ff00';
    const textLines = visibleText.split('\n');
    for(let i = 0; i < textLines.length; i++) {
        const line = textLines[i];
        ctx.fillText(line, 30, 50 + (i * 50));
    }
    screenMaterial.map = new THREE.CanvasTexture(canvas);
    screenMaterial.map.needsUpdate = true;
    screenMaterial.needsUpdate = true;
    //mappedLines = lines.map(line => line.substring(0, bootProgress));
    if(bootProgress < Math.max(...lines.map(l => l.length))) {
        bootProgress++;
        setTimeout(render_powerupScreen, 50 + Math.random() * 50);
    } 
    else {
        readyscreen();
    }
}