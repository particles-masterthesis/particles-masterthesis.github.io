export default function(dataStore, ui, canvas, update){
    let folderDataSet = ui.DatGui.addFolder('DataSet');

    folderDataSet.add(dataStore, "useSubset").onChange(() => {
        dataStore.createSubset();
        canvas.removeParticles();
        canvas.removeVisualization();
        update();
    });
    folderDataSet.add(dataStore, 'sizeOfSubset', 1, 3000).onChange(() => {
        dataStore.sizeOfSubset = Math.floor(dataStore.sizeOfSubset);
        dataStore.createSubset();
        canvas.removeParticles();
        canvas.removeVisualization();
        update();
    });

    folderDataSet.open();
}
