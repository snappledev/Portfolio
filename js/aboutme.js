let scene, camera, renderer, model,  modelWrapper, currentWrapper, currentAction;
let rotateX = 0, rotateY = 0;
let rotateautomatically = true;
let bWireFrame = true;
let rotationSpeed = 0.01;
let mixer = null;;
let globalRotation = 0;
let clock = new THREE.Clock(); 
init();
loadModel();


function init() {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(10, (document.querySelector('#canavsbox').offsetWidth / document.querySelector('#canavsbox').offsetHeight), 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(document.querySelector('#canavsbox').offsetWidth, document.querySelector('#canavsbox').offsetHeight);

    renderer.domElement.style.position = 'absolute';
    document.getElementById('canavsbox').appendChild(renderer.domElement);
  
    //const controls = new THREE.OrbitControls(camera, renderer.domElement);


    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    //const point = new THREE.PointLight(0xffffff, 0.6);
    scene.add(ambient);
    
    const dirLite = new THREE.DirectionalLight(0xAAffAA, 0.3 );
    dirLite.position.set(5, 5, 15);
    scene.add(dirLite);
    

    camera.position.z = 65;
    camera.position.y = 0;
    animate();
}
function loadModel(path = 'assets/player.gltf', onLoaded = null) {
    if (modelWrapper) {
        scene.remove(modelWrapper);
        modelWrapper = null;
        model = null;
    }

    const loader = new THREE.GLTFLoader();
    loader.load(path, (gltf) => {
        model = gltf.scene;

        if (gltf.animations?.length) {
            mixer = new THREE.AnimationMixer(model);
            currentAction = mixer.clipAction(gltf.animations[0]);
            currentAction.play();
        }

        modelWrapper = new THREE.Object3D();
        modelWrapper.add(model);
      
        if (path == "assets/player.gltf") {
            modelWrapper.scale.set(4, 4, 4);
            modelWrapper.position.set(0, -4, 0);
            //-2
            modelWrapper.rotation.set(Math.PI / 2, 0, 0);
            modelWrapper.rotation.z = globalRotation;
        }
        else if (path == "assets/Computer Model two.glb") {
            modelWrapper.scale.set(1.6, 1.6, 1.6);
            modelWrapper.position.set(0, -1, 0);
            modelWrapper.rotation.set(0.3, 0,0);
            //modelWrapper.rotation.z = globalRotation;

        }
        else if (path == "assets/DMA moedl.gltf"){
            modelWrapper.scale.set(0.8, 0.8, 0.8);
            modelWrapper.position.set(0, 0, 0);
            modelWrapper.rotation.set(0.3, 0,0);
        }
        else{
            modelWrapper.scale.set(0.6, 0.6, 0.6);
            modelWrapper.position.set(0, 3, 0);
            modelWrapper.rotation.set(0.3, 0,0);
        }
     
        scene.add(modelWrapper);
        currentWrapper = modelWrapper;


        //model.wireframe = true
        //for (let i = 0; i < model.children.length; i++) {
        //    model.children[i].material.wireframe = true;
        //}
        model.traverse((child) => {
            if (child?.isMesh) {
                child.userData.originalMaterial = { color: child.material.color.clone(), map: child.material.map, wireframe: child.material.wireframe  };
                
                if(bWireFrame) {
                    //green 0x00ff00
                    child.material.color.set(0x00ff00);
                    child.material.map = null;
                    child.material.wireframe = true;
                }
            }
        });

        if (onLoaded) 
            onLoaded();
    });
}

function animate() {
    const delta = clock.getDelta();
    
    requestAnimationFrame(animate);
    
    if (rotateautomatically) 
        globalRotation += rotationSpeed * (delta * 60);
    
    if (currentWrapper) {
        if (document.getElementById('modelSelect').value == "assets/player.gltf") {
            currentWrapper.rotation.z = globalRotation;
        }
        else{
            currentWrapper.rotation.y = globalRotation;
        }
    }

    if (mixer) 
        mixer.update(delta);
    
    TWEEN.update();
    renderer.render(scene, camera);
}
function playSurrender(path, callAFter) {
    const loader = new THREE.GLTFLoader();
    loader.load(path, (gltf) => {
        const tempModel = gltf.scene;
        
        gltf.animations = gltf.animations.filter(anim => !anim.tracks.some(track => track.name.includes('rotation')));
        tempModel.traverse((child) => {
            if (child?.isMesh) {
                child.userData.originalMaterial = { color: child.material.color.clone(), map: child.material.map, wireframe: child.material.wireframe };

                if(bWireFrame) {
                    child.material.color.set(0x00ff00);
                    child.material.map = null;
                    child.material.wireframe = true;
                }
            }
        });

        const wrapper = new THREE.Object3D();
        wrapper.add(tempModel);
        wrapper.scale.set(4, 4, 4);
        wrapper.position.set(0, -4, 0);
        wrapper.rotation.set(Math.PI / 2, 0, globalRotation);
        scene.add(wrapper);
        currentWrapper = wrapper;


        const newmixer = new THREE.AnimationMixer(tempModel);
        const clip = gltf.animations[0];
        const action = newmixer.clipAction(clip);
        action.setLoop(THREE.LoopOnce);
        action.clampWhenFinished = true;
        action.play();

        mixer = newmixer;

        if (modelWrapper) 
            scene.remove(modelWrapper);

        newmixer.addEventListener('finished', () =>
        {
            scene.remove(wrapper);
            mixer = null;
            if (callAFter) 
                callAFter();
        });
    });
}

let disablePlaySurrender = false;

document.getElementById('playSurrender').addEventListener('click', () => 
{
    if (document.getElementById('modelSelect').value != "assets/player.gltf")
        return;

    
    document.getElementById('playSurrender').setAttribute('disabled', 'true');
    if (currentAction?.isRunning()) {

        const cycle = currentAction.getClip().duration;
        const remaining = cycle - (currentAction.getMixer().time % cycle);
        //let cyclelength = currentAction.
        setTimeout(() => { playSurrender('assets/player_wave.gltf', () => { loadModel('assets/player.gltf');  document.getElementById('playSurrender').removeAttribute('disabled', 'false') }); }, remaining * 1000);
    } 
    else {
        playSurrender('assets/player_wave.gltf', () => { loadModel('assets/player.gltf'); });
    }
});


document.getElementById('toggleRotation').addEventListener('click', () => 
{
    //toggle
    rotateautomatically = !rotateautomatically;
    if (rotateautomatically) {
        document.getElementById('toggleRotation').textContent = 'Rotation: Off';
    } 
    else {
        document.getElementById('toggleRotation').textContent = 'Rotation: On';
    }
});


document.getElementById('wireframeBtn').addEventListener('click', () => 
{
    bWireFrame = !bWireFrame;
    scene.traverse((object) => {
        if (object.isMesh) {
            if(bWireFrame) {
                
                object.material.map = null;
                object.material.needsUpdate = true;
                object.material.color.set(0x00ff00);
                object.material.wireframe = true;
            } 
            else {
                
                if(object.userData.originalMaterial) {
                    object.material.color.copy(object.userData.originalMaterial.color);
                    object.material.map = object.userData.originalMaterial.map;
                    object.material.wireframe = object.userData.originalMaterial.wireframe;
                    object.material.needsUpdate = true;
                }
            }
        }
    });
    const btn = document.getElementById('wireframeBtn');
    btn.textContent = `Wireframe: ${bWireFrame ? 'ON' : 'OFF'}`;
});
document.getElementById('speedControl').addEventListener('input', (e) => 
{
    rotationSpeed = e.target.value * 0.01;
});

document.getElementById('modelSelect').addEventListener('change', (e) => 
{
    loadModel(e.target.value);
});
window.addEventListener('resize', () => 
{
    const container = document.querySelector('#canavsbox');
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
});