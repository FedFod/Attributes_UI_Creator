autowatch = 1;
include("Attributes_Types.js");
include("Obj_Creators.js");

var p = this.patcher; 

var attrArgsList = [];
var attruiList = [];

function fillAttrArgs() {
    var args = arrayfromargs(arguments);
    var contains = 0;
    for (var i=0; i<attrArgsList.length; i++) {
        if (attrArgsList[i][0] == args[0]) {
            attrArgsList[i] = args;
            contains = 1;
        }
    }
    if (!contains) {
        attrArgsList.push(args);
    }
    // print(args)
}

function createAttributesUI() {
    print("how many attributes: "+attrArgsList.length);
    removeAttributesObjects();
    var offsetFromName = 65;

    // for (var i=0; i<attrArgsList.length; i++) {
    //     var indexOfArg = transforms.indexOf(attrArgsList[i][0]);
    //     if (indexOfArg >= 0) {
    //         var position = [100, (indexOfArg*25)+30];
    //         var attrName = attrArgsList[i][0];
    //         attruiList[attrName] = { attrNameComment: "", attrArgsObjects: [], listener: {} }; 

    //         attruiList[attrName].attrNameComment = createAttrNameComment(position, attrName);
    //         position[0]+=offsetFromName;
    //         createArgsObjectsForAttr(i, attrArgsList, attruiList, position, attrName); 
    //     }
    // }

    for (var i=0; i<attrArgsList.length; i++) {
        var position = [100, (i*25)+30];
        var attrName = attrArgsList[i][0];
        var attrArgsLength = attrArgsList[i].length;
        attruiList[attrName] = { attrNameComment: "", attrArgsObjects: [], listener: {} }; 

        attruiList[attrName].attrNameComment = createAttrNameComment(position, attrName);

        for (var j=1; j<attrArgsLength; j++) {
            var argVal = attrArgsList[i][j];
            var argObjPosition = [position[0]+offsetFromName+(j*53), position[1]];
            attruiList[attrName].attrArgsObjects.push(createArgObject(attrArgsLength, argObjPosition, argVal, j, attrName))
            attruiList[attrName].listener = new MaxobjListener(attruiList[attrName].attrArgsObjects[j-1], callbackFun);
        }
    }
}

function removeAttributesObjects() {
    gc();
    for (var obj in attruiList) {
        p.remove(attruiList[obj].attrNameComment);
        for (var num in attruiList[obj].attrArgsObjects) {
            p.remove(attruiList[obj].attrArgsObjects[num]);
        }
    }
    attruiList = [];
}

function callbackFun(data) {
    var attrName = data.maxobject.attributeName;
    var indexInAttr = data.maxobject.indexInAttr;
    var outMessage = attrName;
    var argValues = [];
    var thisObj = attruiList[attrName].attrArgsObjects[indexInAttr];

    if (thisObj.type === "umenu") {
        thisObj.objVal = thisObj.items[data.value];
    } else {
        thisObj.objVal = data.value;
    }

    for (var i=0; i<attruiList[attrName].attrArgsObjects.length; i++) {
        argValues.push(attruiList[attrName].attrArgsObjects[i].objVal);
    }
    outlet(0, outMessage, argValues);
}

function notifydeleted() {
    print("cleaning up");
    removeAttributesObjects();
    emptyAttributeStatesList();
}

function emptyAttributeStatesList() {
    attrArgsList = [];
}
