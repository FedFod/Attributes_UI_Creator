function Selector(position, chooser) {
    this.chooser = null;
    if (chooser) {
        this.chooser = chooser;
        this.chooser.message("clear");
    } else {
        this.chooser = p.newdefault(position[0], position[1], "chooser");
    }
    this.chooser.message("selectedclick", 1);
    this.rect = this.chooser.rect;
    this.chooser.varname = "interface_selector";

    this.mouseCounter = 0;
    this.elementSelected = null;
    this.elementPrevSelected = null;
    this.mouseIndicator = null;

    this.interfacesDict = new Dict("interfacesDict");
    this.interfacesDict.import_json("Interfaces.json");
    this.interfacesTypes = this.interfacesDict.getkeys();

    for (var i=0; i<this.interfacesTypes.length; i++) {
        this.chooser.message("append", this.interfacesTypes[i]);
    }

    this.addListener = function() {
        if (this.chooser.listener == null) {
            this.chooser.listener = new MaxobjListener(this.chooser, selectorCallback);
        }
    }

    this.assignElementSelected = function(index) {
        this.elementSelected = this.interfacesTypes[index];
    }

    this.deselectLatestElement = function() {
        this.chooser.message("deselect");
        this.elementSelected = null;
        this.elementPrevSelected = null;
    }

    this.destroy = function() {
        p.remove(this.chooser);
        this.chooser = null;
    }
}

function selectorCallback(data) {
    selector.assignElementSelected(data.value);
    globalObj.interfaceGenerator.createInterface(selector.elementSelected, [mouseState.x, mouseState.y]);
    
    if (selector.elementSelected != selector.elementPrevSelected) {
        selector.mouseCounter = 0;
    }
    selector.elementPrevSelected = selector.elementSelected;
    print("selected "+selector.elementSelected)
}
selectorCallback.local = 1;

function setMouseState(click, x, y) {
    mouseState.isClicked = click;
    mouseState.x = x;
    mouseState.y = y;

    if (selector != null) {
        if (selector.elementSelected != null && mouseState.isClicked) {
            globalObj.interfaceGenerator.moveNewestInterface(mouseState.calcPosDiff());
        }
        if (selector.elementSelected != null && !mouseState.isClicked && mouseState.prevClick) {
            globalObj.interfaceGenerator.showNewestInterface();
            selector.deselectLatestElement();
        }
    }
    if (mouseState.isClicked != mouseState.prevClick) {
        mouseState.prevClick = mouseState.isClicked;
    }
    mouseState.prevX = mouseState.x;
    mouseState.prevY = mouseState.y;
}  
