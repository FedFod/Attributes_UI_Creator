function createAttrNameComment(position, attrName) {
    var attrNameComment = p.newobject("comment", position[0], position[1], 121, 15);
    attrNameComment.set(attrName);
    return attrNameComment;
}

function createIntegerNumberObj(position, val){
    var argObj = (p.newdefault(position[0], position[1], "number"));
    argObj.message("int", val);
    return argObj;
}

function createFloatNumberObj(position, val) {
    var argObj = (p.newdefault(position[0], position[1], "flonum"));
    argObj.message("float", val);
    return argObj;
}

function createToggleObj(position, val) {
    var argObj = (p.newdefault(position[0], position[1], "toggle"));
    argObj.message("int", val);
    return argObj;
}

function createUmenuObj(position, val, attrName) {
    var textObj = p.newdefault(position[0], position[1], "umenu");
    textObj.type = "umenu";
    fillUmenu(attrName,textObj);
    textObj.set(val);
    return textObj;
}

function createTexteditObj(position, val) {
    var textObj = p.newdefault(position[0], position[1], "textedit");
    textObj.rect = [position[0], position[1]+2, position[0]+100, position[1]+22];
    textObj.message("lines", 1);
    textObj.message("keymode", 1);
    textObj.message("rounded", 0);
    textObj.set(val);
    return textObj;
}

function attachPropertiesToArgObjects(argObj, argVal, index, attrName) {
    argObj.objVal = argVal;
    argObj.indexInAttr = index-1;
    argObj.attributeName = attrName;
}

function createTextOrUmenuObject(position, argVal, attrName) {
    var textObj = null;

    if (umenuAttributes.hasOwnProperty(attrName)) {
        textObj = createUmenuObj(position, argVal, attrName);
    } else {
        textObj = createTexteditObj(position, argVal);
    } 
    return textObj;
}

function createNumberOrToggleObject(attrListLength, position, argVal, attrName) {
    var argObj = null;

    var isInteger = (integerAttributes.indexOf(attrName) >= 0);
    var isSingleNumber = (singleNumberAttributes.indexOf(attrName) >= 0)

    if (attrListLength == 2) { // check if it's a single argument
        if (isSingleNumber) { // check if it's a single integer number, not a toggle
            if (isInteger) {
                argObj = createIntegerNumberObj(position, argVal);
            } else {
                argObj = createFloatNumberObj(position, argVal);
            }
        } else {
            argObj = createToggleObj(position, argVal);
        }
    } else {
        if (isInteger) {
            argObj = createIntegerNumberObj(position, argVal);
        } else {
            argObj = createFloatNumberObj(position, argVal);
        }
    }
    return argObj;
}

function createArgObject(attrListLength, position, argVal, index, attrName) {
    var argObj = null;
    if ((typeof argVal) == "string" || umenuAttributes.hasOwnProperty(attrName)) {
        argObj = (createTextOrUmenuObject([position[0], position[1]], argVal, attrName));
    } else {
        argObj = createNumberOrToggleObject(attrListLength, position, argVal, attrName);
    }
    attachPropertiesToArgObjects(argObj, argVal, index, attrName);
    minAndMaxObj(argObj, attrName);
    return argObj;
}

function createArgsObjectsForAttr(index, attrList, attrObjectsList, position, attrName) {
    for (var j=1; j<attrList[index].length; j++) {
        var argVal = attrList[index][j];
        var argObjPosition = [position[0]+(j*53), position[1]];
        attrObjectsList[attrName].attrArgsObjects.push(createArgObject(attrList[index].length, argObjPosition, argVal, j, attrName))
        attrObjectsList[attrName].listener = new MaxobjListener(attrObjectsList[attrName].attrArgsObjects[j-1], callbackFun);
    }
}