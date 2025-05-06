
function moveCamera(newPositionj, newTarget, duration, runonfinish) {
    const start = camera.position.clone();
    const target = controls.target.clone();
    const initialtime = performance.now();
    function move() {
        //delta = (performance.now() - initialtime) / 1000;
        const delta = performance.now() - initialtime;
        let completionpercent = delta / duration;
        if (completionpercent > 1) {
            completionpercent = 1;
        }

        camera.position.x = start.x + (newPositionj.x - start.x) * completionpercent;

        camera.position.y = start.y + (newPositionj.y - start.y) * completionpercent;
        camera.position.z = start.z + (newPositionj.z - start.z) * completionpercent;
        
        controls.target.x = target.x + (newTarget.x - target.x) * completionpercent;
        controls.target.y = target.y + (newTarget.y - target.y) * completionpercent;
        controls.target.z = target.z + (newTarget.z - target.z) * completionpercent;
        
 
        controls.update();
        if(completionpercent < 1) {
            setTimeout(move, 16);
        } 
        else {
            if(runonfinish) { 
                runonfinish();
            }
        }
    }
    move();
}