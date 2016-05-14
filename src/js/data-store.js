/* jshint esversion: 6 */

export default class DataStore{
    constructor(){
        this.subset = [];
        this.features = [];
        this.schema = {};

        this.sizeOfSubset = 100;

        this.currentSelection = {
            x: null,
            y: null
        };
    }

    getMaxAndMinValuesFromSelectedFeatures() {
        let maxValueX = 0, minValueX = 0;
        let maxValueY = 0, minValueY = 0;
        let x = 0, y = 0;

        for (let i = 0; i < this.subset.length; i++) {
            x = parseFloat(this.subset[i][this.currentSelection.x]);
            y = parseFloat(this.subset[i][this.currentSelection.y]);

            if (x > maxValueX) {
                maxValueX = x;
            } else if (x < minValueX) {
                minValueX = x;
            }

            if (y > maxValueY) {
                maxValueY = y;
            } else if (y < minValueY) {
                minValueY = y;
            }
        }

        return {
            maxX: maxValueX,
            minX: minValueX,
            maxY: maxValueY,
            minY: minValueY
        };
    }
    createFeatures(header = []) {
        this.features = [];

        for (const feature in header) {
            if (header.hasOwnProperty(feature)) {
                this.features.push(feature);
            }
        }
    }

    classifyFeatures() {
        this.schema = {};

        let key = null, cell = null;
        for (let i = 0; i < this.features.length; i++) {
            key = this.features[i];
            cell = this.subset[0][key];

            if (cell.isNumeric()) {
                this.schema[key] = "numeric";
            }
            else if (cell.isDate()) {
                this.schema[key] = "date";
            }
            else if (typeof cell === "string") {
                this.schema[key] = "nominal";
            }
            else {
                this.schema[key] = "unknown";
            }
        }
    }

    createSubset(){
        this.subset = [];

        let indices = [], idx = 0;
        while (this.subset.length < this.sizeOfSubset) {
            idx = Math.floor(Math.random() * this.dataset.length);
            if (indices.indexOf(idx) < 0) {
                indices.push(idx);
                this.subset.push(this.dataset[idx]);
            }
        }
        console.info(`Created subset with ${this.sizeOfSubset} items.`);
    }

    import(url) {

        $.ajax({
            async: false,
            context: this,
            dataType: "text",
            type: "GET",
            url,
            error(XMLHttpRequest, textStatus, errorThrown) {
                console.error(XMLHttpRequest, textStatus, errorThrown);
            },
            success(data) {
                this.dataset = $.csv.toObjects(data, {"separator": ";", "delimiter": ";"});
                console.info("Imported dataset.");

                const header = this.dataset.shift();
                this.createFeatures(header);
                this.createSubset();
                this.classifyFeatures();

                this.currentSelection.x = this.currentSelection.y = this.features[0];
            }
        });

    }
}