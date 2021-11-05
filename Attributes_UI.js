autowatch = 1;
outlets = 1;
include("Obj_Creators.js");
include("BPatcherGenerator.js");
include("Selector.js");

var p = this.patcher;
var pp = this.patcher.parentpatcher; 

var globalObj = new Global("interfaces");

var mouseState = { 
    isClicked: 0,
    prevClick: 0,
    x: -1000,
    y: -1000,
    prevX: -1000,
    prevY: -1000,
    calcPosDiff: function() {
        return [this.x-this.prevX, this.y-this.prevY];
    }   
}
var selector = null;
globalObj.interfaceGenerator = new BPatcherGenerator();

var dictName = "interfacesDict";

// function setDictName(dictName) {
//     dictName = dictName;
//     if (selector != null) {
//         p.remove(selector);
//     }
//     createSelector();
// }

function createSelector() {
    selector = new Selector([0,0], p.getnamed("interface_selector"));

    if (selector != null) {
        selector.addListener();
    }
}

function destroyUIInterfaces() {
    globalObj.interfaceGenerator.destroyInterfaces();
}

function destroyAll() { 
    selector.destroy();
    selector = null;
    globalObj.interfaceGenerator.destroyInterfaces();
    gc();
}

function notifydeleted() {
    gc();
}

