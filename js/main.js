var scene, camera, renderer, clock, controls, raycaster;
var container, computerGroup, networkGroup, computerModel;
var isZooming = false, currentStage = "computer", powerOn = false;
var bootProgress = 0, nodeInfoElements = [], hoveredNode = null;
let actions, mixer = []
function resizecanvas() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    //renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth,  container.clientHeight);
}
function init() {

  
    clock = new THREE.Clock();
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010101);
    scene.fog = new THREE.FogExp2(0x020202, 0.05);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 8, 10);
    scene.add(directionalLight);

    ///////////////////////
    container = document.getElementById('canvas');
    const width = container.clientWidth;
    const height = container.clientHeight;
  ///////////////////////////////////////////

    camera = new THREE.PerspectiveCamera(35, width/height, 0.1, 1000);
    camera.position.set(0, 8, 25);
    //camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "low-power" });
    renderer.setPixelRatio(1);
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 2, 0);
    controls.update();
    raycaster = new THREE.Raycaster();
    computerGroup = new THREE.Group();
    scene.add(computerGroup);
    loadcomputer();
  

    //////////////////////////////////////////////////////////
    history.replaceState({ stage: "computer" }, "", "#computer");
    renderer.domElement.addEventListener('click', handleclick, false);
    renderer.domElement.addEventListener('touchstart', handleclick, false);
    window.addEventListener('resize', resizecanvas, false);
    window.addEventListener('popstate', pstagechange, false);
    window.addEventListener('keydown', keypress, false);

    update();

}

/*function domdocload(){
    if (actions){
        actions.forEach(action => {
            action.timeScale = 1;
            action.reset();
            action.play();
        });
    }
    
}*/

function update() {
    requestAnimationFrame(update);
    const deltaTime = clock.getDelta();
    const time = clock.getElapsedTime();
    
    //if (mixer) {
    //  mixer.update(deltaTime);
    //}
    if (currentStage === "network" || currentStage === "node") {
        const mouseWorld = new THREE.Vector3(mouse2D.x, mouse2D.y, 0.5);
        mouseWorld.unproject(camera);
        raycaster.setFromCamera(mouse2D, camera);
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const floatX = 0.08 * Math.sin(time + node.userData.basePosition.x);
            const floatY = 0.08 * Math.cos(time + node.userData.basePosition.y);
            const dist = node.userData.basePosition.distanceTo(mouseWorld);
            const mouseInfluence = new THREE.Vector3();
        
            if (dist < 2) {
                const direction = mouseWorld.clone().sub(node.userData.basePosition).normalize();
                mouseInfluence.copy(direction.multiplyScalar(0.1 * (1 - dist/2)));
            }
        
            node.position.copy(node.userData.basePosition).add(new THREE.Vector3(floatX, floatY, 0)).add(mouseInfluence);
        
            if (node.userData.pulseTime) {
                const elapsed = performance.now() - node.userData.pulseTime;
                if (elapsed < 1000) {
                    const t = elapsed / 1000;
                    const color = new THREE.Color(0x00ff00).lerp(new THREE.Color(0xffffff), 1 - t);
                    node.material.color.copy(color);
                } 
                else {
                    node.material.color.set(0x00ff00);
                    node.userData.pulseTime = null;
                }
            }
        } 
        //for (let i = 0; i < nodes.length; i++) {
        //    const node = nodes[i];
        //    node.material.color.set(0x00ff00);
        //}

        for (let i = 0; i < connections.length; i++) {
            const conn = connections[i];
            conn.line.geometry.setFromPoints([conn.node1.position, conn.node2.position]);
            conn.line.geometry.attributes.position.needsUpdate = true;
            conn.line.material.opacity = conn.baseOpacity + Math.sin(time + conn.phase) * 0.1;
            conn.line.material.needsUpdate = true;
            
            if (conn.isPulsing) {
                  conn.pulseProgress += deltaTime * 2;
                  if (conn.pulseProgress >= 1) {
                      conn.isPulsing = false;
                      conn.mesh.visible = false;
                  } 
                  else {
                      const currentPos = conn.node1.position.clone().lerp(conn.node2.position, conn.pulseProgress);
                      conn.mesh.position.copy(currentPos);
                  }
            }
        }
    
        const intersects = raycaster.intersectObjects(nodes);
        hoveredNode = intersects[0]?.object || null;
        updateNodeTooltips();

    }
    renderer.render(scene, camera);
}
init();
