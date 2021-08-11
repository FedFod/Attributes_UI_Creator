autowatch = 1;

var p = this.patcher; 

var attrNameList = [];
var attrArgsList = [];
var attruiList = [];

function fillAttrList() {
    attrNameList = [];
    attrNameList = arrayfromargs(arguments);
    print("Attributes List Length: "+attrNameList.length);
    //createAttrui();

    attrArgsList = [];

    var indexObj = { index: 0 };
    var tsk = new Task(outputAttrName, this, indexObj);
    tsk.interval = 10;
    tsk.repeat(attrNameList.length-1);
}

function outputAttrName(indexObj) {
    // arguments.callee.task.interval=200;
    outlet(0, "get"+attrNameList[indexObj.index]);
    print(indexObj.index);
    indexObj.index+=1;
}

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
    print(args)
}

function createAttributesUI() {
    print("how many attributes: "+attrArgsList.length);
    removeAttributesObjects();

    for (var i=0; i<attrArgsList.length; i++) {
        var position = [100, (i*25)+30];
        var offsetFromName = 65;
        attruiList.push( { attrName: "", attrArgs: [], listener: {} }); 
        attruiList[i].attrName = p.newobject("comment", position[0], position[1], 121, 15);
        attruiList[i].attrName.set(attrArgsList[i][0]);

        for (var j=1; j<attrArgsList[i].length; j++) {
            if ((typeof attrArgsList[i][j]) == "number") {
                if (attrArgsList[i].length == 2) {
                    attruiList[i].attrArgs.push(p.newdefault(position[0]+offsetFromName+(j*53), position[1], "toggle"));

                    attruiList[i].attrArgs[0].attributeName = attrArgsList[i][0];
                }
                else {
                    attruiList[i].attrArgs.push(p.newdefault(position[0]+offsetFromName+(j*53), position[1], "flonum"));
                    attruiList[i].attrArgs[j-1].message("int", attrArgsList[i][j]);

                    attruiList[i].attrArgs[j-1].attributeName = [attrArgsList[i][0], (j-1)];
                }
            } else if ((typeof attrArgsList[i][j]) == "string") {
                attruiList[i].attrArgs.push(p.newdefault(position[0]+offsetFromName+(j*53), position[1], "textedit"));
                attruiList[i].attrArgs[0].rect = [position[0]+offsetFromName+(j*53), position[1], 
                                                  position[0]+offsetFromName+(j*53)+100, position[1]+20];
                attruiList[i].attrArgs[0].message("lines", 1);
                attruiList[i].attrArgs[0].message("keymode", 1);

                attruiList[i].attrArgs[j-1].attributeName = attrArgsList[i][0];
            }
            attruiList[i].listener = new MaxobjListener(attruiList[i].attrArgs[j-1], callbackFun);
        }
    }
}

function callbackFun(data) {
    print(data.value);
    print(data.maxobject.attributeName);
    var outMessage = [data.maxobject.attributeName[0]];
    if (Array.isArray(data.maxobject.attributeName)) {
        for (var i=0; i<=data.maxobject.attributeName[1]; i++) {
            outMessage.push(data.value);
        }
    }
    outlet(0, outMessage, data.value);
}


function removeAttributesObjects() {
    gc();
    for (var obj in attruiList) {
        p.remove(attruiList[obj].attrName);
        for (var num in attruiList[obj].attrArgs) {
            p.remove(attruiList[obj].attrArgs[num]);
        }
        // p.remove(attruiList[obj].receive);
    }
    attruiList = [];
}

function emptyAttributeStatesList() {
    attrArgsList = [];
}

function createAttrui() {
    removeAttrui();

    for (var i=0; i<attrNameList.length; i++) {
        attruiList.push(p.newdefault(100,(i*25)+30,"attrui"));
        p.connect(attruiList[i], 0, p.getnamed("gridshape"), 0);
        attruiList[i].attr(attrNameList[i]);
    }
}

function removeAttrui() {
    for (var obj in attruiList) {
        p.remove(attruiList[obj]);
    }
    attruiList = [];
}