function renderinfopanel(node) {

    const displaypanelinfo = document.createElement('div');
    displaypanelinfo.className = 'node-info-panel';
    displaypanelinfo.innerHTML = `
        <h2>${node.userData.title || 'Project Title'}</h2>
        <img src="${node.userData.image || 'placeholder.jpg'}" alt="Project Image">
        <p>${node.userData.description || 'Project description...'}</p>
        <a href=" ${node.userData.link  || 'Project link...'}"> [ Link ] </a>
    `;
    document.body.appendChild(displaypanelinfo);


    nodeInfoElements.push(displaypanelinfo);
//////////////////////////////////////////////////////

}



function updateNodeTooltips() {
    if('ontouchstart' in window) 
        return;


    for(let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const tooltip = node.userData.tooltip;
        if(tooltip) {

            if(node === hoveredNode && currentStage === "network") {
                const vec = node.position.clone().project(camera);
    
                tooltip.style.left = `${((vec.x * 0.5 + 0.5) * window.innerWidth)    + 15}px`;
                tooltip.style.top = `${((-vec.y * 0.5 + 0.5) * window.innerHeight)    + 15}px`;
                tooltip.style.transform = 'none';
                tooltip.style.opacity = '1';
            } 
            else {
                tooltip.style.opacity = '0';
            }
        }
    }
}





function zoomOutFromNode() {

    for (let i = 0; i < nodeInfoElements.length; i++) {
        nodeInfoElements[i].remove();
    }
    nodeInfoElements = [];
    isZooming = true;
    moveCamera(minusfiftee, zeroorigin, 1000, () => 
    {
        currentStage = "network";
        isZooming = false;
        history.replaceState({ stage: "network" }, "", "#network");
    });
}