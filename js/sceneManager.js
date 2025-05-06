function changetocomputerscene(){
    /*if (controls.disabled) {
        controls.enabled = true;
        controls.update();
    }*/
    controls.enabled = true;
    currentStage = "computer";
    scene.fog = new THREE.FogExp2(0x010101, 0.04);
    history.replaceState({ stage: "computer" }, "", "#computer");
}
function logoffReverse3() {
    const nwoverlay = document.querySelector('.network-overlay');
    if (nwoverlay) {
        nwoverlay.remove();
    }
    const logoffButton = document.querySelector('.logoff-button');
    if (logoffButton) {
        logoffButton.remove();
      }
      
    for (let i = 0; i < nodeInfoElements.length; i++) {
        nodeInfoElements[i].remove();
    }
    nodeInfoElements = [];
    
    if (networkGroup) {
      scene.remove(networkGroup);
      networkGroup = null;
      nodes = [];
      connections = [];
    }
    
    powerOn = false;
    bootProgress = 0;
    scene.background = new THREE.Color(0x010101);

    /////////////////////////////////
    computerGroup.visible = true;
    screenOverlay.visible = true;
    isScreenActive = false;
    poweroffThaScreen();
    
    moveCamera(new THREE.Vector3(0, 8, 25), new THREE.Vector3(0, 0, 0), 1500, changetocomputerscene);
}
function pstagechange(event) {
    if (event.state) {
      
        if (event.state.stage === "computer" && currentStage !== "computer") 
        {

          logoffReverse3();
        } 
        else if (event.state.stage === "network" && currentStage === "node") 
        {
          zoomOutFromNode();
        }
    }
}



function networkZoomFunc(nodeclicked){

    history.pushState({ stage: "node", node: nodeclicked.id }, "", "#node");
    renderinfopanel(nodeclicked);
    isZooming = false;


}





function handleclick(event) {

    if(event.type === 'touchstart') {
        event.preventDefault();
    }
      

    //if (currentStage === "node") return;

    const scrn = renderer.domElement.getBoundingClientRect();
    let clientX, clientY;
    if(event.touches) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
    } 
    else {
        clientX = event.clientX;
        clientY = event.clientY;
    }
    const mouse = new THREE.Vector2((clientX - scrn.left) / scrn.width * 2 - 1, -(clientY - scrn.top) / scrn.height * 2 + 1);
    
    raycaster.setFromCamera(mouse, camera);
    if (currentStage === "computer") 
    {

      if(raycaster.intersectObject(computerGroup, true).length > 0) 
      {
          if(!powerOn) {
              powerOn = true;
              moveCamera(new THREE.Vector3(0, 4, 12), new THREE.Vector3(0, 3.5, 8),1500, render_powerupScreen);
              isScreenActive = true;
          } 
          else if(isScreenActive) 
          {
              if(raycaster.intersectObject(screenOverlay).length > 0) 
              {
                  moveCamera(new THREE.Vector3(0, 2.5, 0.4), new THREE.Vector3(0, 2.5, 0), 1000, prepnetwork);
              }
          }
      }
    } 
    else if (currentStage === "network") 
    {
        const intersects = raycaster.intersectObjects(nodes);
        if(intersects.length > 0) {
            const nodeclicked = intersects[0].object;
            const targetPos = nodeclicked.getWorldPosition(new THREE.Vector3());
            //const targetPos2 = nodeclicked.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0, 1.5));
            const newCameraPos = targetPos.clone().add(new THREE.Vector3(0, 0, 1.5));
            //const newCameraPos2 = targetPos.clone().add(new THREE.Vector3(0, 0, 3.5));

            if(!isZooming) {
                isZooming = true;
                currentStage = "node";
                moveCamera(newCameraPos, targetPos, 1000, () => 
                { 
                    history.pushState({ stage: "node", node: nodeclicked.id }, "", "#node");
                    renderinfopanel(nodeclicked);
                    isZooming = false;
                });
            }
            else{

            }
        }
    } 
    else if (currentStage === "node") {
      zoomOutFromNode();
    }
    else{

    }
}


function keypress(event) {
    if (event.key === 'Escape' && currentStage === "node") {
        zoomOutFromNode();
    }
}