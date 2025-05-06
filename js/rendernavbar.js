function addprojectstonav() {
    const dropdownMenu = document.querySelector('.dropdown-menu');
    while (dropdownMenu.children.length > 1) {
        dropdownMenu.removeChild(dropdownMenu.lastChild);
    }
    for (let i = 0; i < nodeInformation.length; i++) {
        //let name = nodeinformation[i]['title']
        const nodeSet = nodeInformation[i];
        for (let j = 0; j < nodeSet.length; j++) {
            const node = nodeSet[j];
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            
            link.className = 'dropdown-item';
            //link.href = //node.link;
            //TO DO
            //Add reference to each node page
            //would take too much time currently to do this
            link.href = "index.html"
            link.textContent = node.title;
            
            listItem.appendChild(link);
            dropdownMenu.appendChild(listItem);
        }
    }
}
document.addEventListener('DOMContentLoaded', addprojectstonav);