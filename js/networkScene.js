
const zeroorigin = new THREE.Vector3(0, 0, 0);
const minusfiftee = new THREE.Vector3(0, 0, 15)
var nodes = [];
var connections = [];
var mouse2D = new THREE.Vector2();
/*const nodeInformation  = [
    [{title: "blanc.cc", description: "BLANC was a minimalistic mod solo created to create a cheap and high quality experience. Developed with C++, it featured a intuitive custom menu and innovative features.", image: "assets/projectimages/blanc.png", link: "https://www.youtube.com/watch?v=KFTPawJKcR4"}],
    [{title: "Shorts Generator", description: "This tool was developed based on the public ShortGPT framework. This project implemented free versions of GPT, Voice2Text and included higher quality voice production. This system was developed as an improvement over the publicly available source, as it required API access keys. This did not, and featured more detailed prompts and captioning systems. Used to post to automatic youtube shorts to multiple channels and funnel viewers to alternative forms of revenue.", image: "assets/projectimages/shortGPT.png", link: "#"},
      {title: "RedEyeCheats V5", description: "RedEyeCheatsV5 was a C++ commision project developed for a provider as they had lost their developer. Working with the provider and against time constraints, RedEyeCheatsV5 was solo developed to meet the demands and security needs of a client.", image: "assets/projectimages/redeye.png", link: "https://www.youtube.com/watch?v=OEfR0n84zX8"}, 
       {title: "EdgeAim V1", description: "EdgeAim V1 was developed as a client request for my late friend Swift. This project was designed around the Window 10 settings GUI, and aimed to replicate it. This project was still in development when he passed, stopping the development. Rest in peace Swift.", image: "assets/projectimages/edgeaim_v1.png", link: "#"}],
    [{title: "Radical Heights", description: "During the battle royal phase, a 70s themed Radical Heights game was released. This client was developed before the game was shut down a few months later, based upon unreal engine. Featured a new design of GUI.", image: "assets/projectimages/radialheights.png", link: "#"},
       {title: "EdgeAim AI Aimbot", description: "Utilising YOLOv5, this universal aimbot was trained on a custom gathered dataset spanning 6 different games. Training images were collected using custom clients. This was linked to an online GUI for easy modification of settings, and featured innovative features such as AI weapon detection for weapon specific settings. This was developed using C++ and HTML, javascript, php, and related open source projects, intended for selling but was never saw a public released. ", image: "assets/projectimages/edgeaim.png", link: "#"}, 
       {title: "Rules Of Survival", description: "This client was developed for the game Rules of Survival before its rework. This included game-breaking features such as teleportation, height adjustment and many other features. Due to the limited restrictions on writing memory within this game, many features were possible that SHOULD NOT have been possible on an online game. Videos of this client achieved 200k views on YouTube.", image: "assets/projectimages/rulesofsurvival.png", link: "#"}],
    [{title: "Edge MM Loader", description: "With a design inspired by GeForce experience, this was a manual map injector designed for the EdgeAim V1 website, intended for multiple different games.", image: "assets/projectimages/manualmap.png", link: "#"}, 
      {title: "CSFloat Price-gap ", description: "I developed this tool to find listings on CSFloat (A CS2 marketplace) with a high margin between its counterpart listed on the steam market. By buying these items and re-selling on the steam market, you can achieve a profit. This is due to steam market prices being inflated. This steam balance can then be exchanged for Steam decks, which can then be sold for cash, starting the cycle again. This tool will automatically find prices with the perfect margins. Written in python.", image: "assets/projectimages/csfloat.png", link: "#"}, 
      {title: "reVival", description: "reVival was a 2D survival game developed from pure C++ without a game engine. This was created for an Alevel games project to challenge myself in new areas at the time. This game featured a full entity system, breakable entities, drops, GL Based rendering and context of position layering.", image: "assets/projectimages/reVival.png", link: "#"}],
    [{title: "drawAuth", description: "drawAuth uses the power of machine learning to recognise imposters attempting to access your phone through grid-unlock by learning how your finger moves. This was developed as part of my dissertation, collecting data from 15 participants and achieved an impressive EER of 0.17 percent. This was written in javascript with flask for the web-app, and Python for the data analysis.", image: "assets/projectimages/drawauth.png", link: "#"}]
  ]*/

function makePulsMaterial2() {
    const mat = new THREE.LineBasicMaterial({color: 0x00ff00, transparent: true, opacity: 0.5 /* Math.random() * 0.5 + 0.1 */});
    let pulse = 0;
    let isPulsing = false;
    function animatethepulse() {

        if(!isPulsing) 
            return;

        pulse += 0.02;
        mat.opacity = 0.5 + Math.sin(pulse) * 0.3;
        mat.color = new THREE.Color(0.8, 0.8, 0.8);
        //material.color = new THREE.color(0.8, 0.8, 0.8, 0.5 + Math.sin(pulse) * 0.3);
        if(pulse > Math.PI * 2) {
            pulse = 0;
        }
    }


    setInterval(animatethepulse, 50);

    return material;
}
function triggermouse_move(event) {
    const  screem= renderer.domElement.getBoundingClientRect();
    mouse2D.x = ((event.clientX - screem.left) / screem.width) * 2 - 1;
    mouse2D.y = -((event.clientY - screem.top) / screem.height) * 2 + 1;
    //((event.clientY - rect.top) / rect.height) * 2;
}

/*function reconnectNodes() {
    connections.forEach(conn => networkGroup.remove(conn.line));
    connections = [];
    for(let i = 0; i < nodes.length - 1; i++) {
        const node1 = nodes[i];
        const tgets = nodes.slice(i + 1).filter(n =>  Math.abs(n.position.x - node1.position.x) < 3);
        
        if(tgets.length > 0) {
            const node2 = tgets[Math.floor(Math.random() * tgets.length)];
            const lineGeom = new THREE.BufferGeometry().setFromPoints([node1.position, node2.position]);
            const lineMat = makePulsMaterial2();
            const line = new THREE.Line(lineGeom, makePulsMaterial2());
            
            connections.push({line,node1,node2,progress: 0,speed: Math.random() * 0.005 + 0.001});
            networkGroup.add(line);
        }
    }
}

*/
function makeNN() {
    nodes = [];
    connections = [];
    nodeInfoElements.forEach(el => el.remove());
    nodeInfoElements = [];

    const baseSpacing = Math.max(window.innerWidth, 400) * 0.00252;
    
    const layers = [{ count: 1, x: -baseSpacing }, { count: 3, x: -baseSpacing/2 }, { count: 3, x: 0 }, { count: 3, x: baseSpacing/2 }, { count: 1, x: baseSpacing } ];
    
    for (let i = 0; i < layers.length; i++) {
        const layer = layers[i];
        const offset = -(2 * (layer.count - 1)) / 2;
        
        for(let j = 0; j < layer.count; j++) {
            const geometry = new THREE.CircleGeometry(0.4, 32);
            //const material = new THREE.MeshBasicMaterial();
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, depthTest: false, depthWrite: false});
            const node = new THREE.Mesh(geometry, material);
            //const node = new THREE.Mesh(geometry, makePulsMaterial2());
            node.renderOrder = 2;
            node.userData = {
                basePosition: new THREE.Vector3(layer.x, (offset + j * 2), 0),
                title: nodeInformation[i][j]["title"],
                description: nodeInformation[i][j]["description"],
                image: nodeInformation[i][j]["image"],
                link: nodeInformation[i][j]["link"],
                pulseTime: null,
                phase: Math.random() * Math.PI * 2
            };
            node.position.copy(node.userData.basePosition);

            //////////////////////////////////////////
            const preview = document.createElement('div');
            //const preview = getDocumentById('tooltip');
            preview.className = 'node-tooltip';
            preview.innerHTML = `
                <h3>${node.userData.title}</h3>
                <img src="${node.userData.image}" alt="Preview">
            `;
            preview.style.opacity = '0';
            document.body.appendChild(preview);
            node.userData.tooltip = preview;
            ////////////////////////////////////////////////
            nodes.push(node);
            networkGroup.add(node);
        }
    }






    for(let i = 0; i < layers.length - 1; i++) {
        const layerNodes1 = nodes.filter(n => Math.abs(n.userData.basePosition.x - layers[i].x) < 0.1);
        const layerNodes2 = nodes.filter(n => Math.abs(n.userData.basePosition.x - layers[i + 1].x) < 0.1);
        
        for (let j = 0; j < layerNodes1.length; j++) {
            const n1 = layerNodes1[j];
            
            for (let k = 0; k < layerNodes2.length; k++) {
                const n2 = layerNodes2[k];
               // if(n1 === n2) continue;
                const geomMLine = new THREE.BufferGeometry().setFromPoints([n1.position, n2.position]);
                const matforLine = new THREE.LineBasicMaterial({color: 0x00ff00, transparent: true, opacity: 0.3, depthWrite: false, depthTest: true});
                
                const line = new THREE.Line(geomMLine, matforLine);
                line.renderOrder = 1;
                //line.geometry.attributes.position.needsUpdate = true;   
                ////////////////////////////////////////////////////////////////////////////////////////////
                const g_p = new THREE.SphereGeometry(0.04, 8, 8);
                const m_p = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true,opacity: 0.9});
                const mesh = new THREE.Mesh(g_p,  m_p);
                mesh.visible = false;
                networkGroup.add(mesh);
                
                connections.push({node1: n1, node2: n2, line, mesh, isPulsing: false, pulseProgress: 0, baseOpacity: 0.3 + Math.random() * 0.2, phase: Math.random() * Math.PI * 2 });
                networkGroup.add(line);
            };
        };
    }
    const pulseInterval = setInterval(() => 
    {    //if(isZooming) return;
        if(currentStage !== "network") {
            clearInterval(pulseInterval);
            return;
        }
        const leftmostNode = nodes.reduce((prev, current) =>  (prev.userData.basePosition.x < current.userData.basePosition.x) ? prev : current);
        if(leftmostNode) {
            leftmostNode.userData.pulseTime = performance.now();
            triggerPulse(leftmostNode);
        }
    }, 2665);

    renderer.domElement.addEventListener('mousemove', triggermouse_move, false);
}
//renderer.domElement.addEventListener('mousemove', mouseMove, false);


function triggerPulse(node) {
    const pulsez = connections.filter(conn => conn.node1 === node &&  conn.node2.userData.basePosition.x > node.userData.basePosition.x);
    pulsez.forEach(conn => 
    {
        if(!conn.isPulsing && Math.random() < 0.7) {
            conn.isPulsing = true;
            conn.pulseProgress = 0;
            conn.mesh.visible = true;
          
            setTimeout(() =>
            {
                //fifty fifty if we trigger another pulse
                if(Math.random() < 0.5) {
                    triggerPulse(conn.node2);
                }
            }, 500); 
        }
    });
}





function changescenetonetwork(){
    currentStage = "network";
    history.pushState({ stage: "network" }, "", "#network");
}





function prepnetwork() {
    if (networkGroup) 
        return;
    const novalay = document.createElement('div');
    novalay.className = 'network-overlay';
    document.body.appendChild(novalay);


//////////////////////////////////////////////////////////////////
    const logoffButton = document.createElement('div');
    logoffButton.className = 'logoff-button';
    logoffButton.textContent = '> Log Off';
    logoffButton.addEventListener('click', logoffReverse3);
    document.body.appendChild(logoffButton);



    controls.enabled = false;
    computerGroup.visible = false;
    scene.background = new THREE.Color(0x000000);
    screenOverlay.visible = false;

    networkGroup = new THREE.Group();
    scene.add(networkGroup);
    makeNN();
    
    moveCamera(minusfiftee, zeroorigin, 1000,  changescenetonetwork);
}