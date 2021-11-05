autowatch = 1;
outlets = 1;
include("Obj_Creators.js");
include("Interface.js");

var p = this.patcher; 
var pp = this.parentpatcher;
var jsthis = this.box; //p.getnamed("jsobj");
var interface = null;

var globalObj = new Global("interfaces");

function createInterface(interfaceClass, interfaceVarname) {
    interface = new Interface([5, 0]);
    print("int varname "+interfaceVarname)
    interface.initInterface(interfaceClass, interfaceVarname);
    interface.showInterface();
}

function destroyAll() { 
    interface.destroyInterface();
}

function notifydeleted() {
    gc();
}

