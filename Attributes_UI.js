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
    attrArgsList.push(arrayfromargs(arguments));
}

function createAttributesUI() {
    removeAttributesObjects();

    for (var i=0; i<attrArgsList.length; i++) {
        var position = [100, (i*25)+30];
        attruiList.push( { attrName: "", attrArgs: [] }); 
        attruiList[i].attrName = p.newdefault(position[0], position[1], "comment");
        attruiList[i].attrName.set(attrArgsList[i][0]);

        for (var j=1; j<attrArgsList[i].length; j++) {
            if ((typeof attrArgsList[i][j]) == "number") {
                if (attrArgsList[i].length == 2) {
                    attruiList[i].attrArgs.push(p.newdefault(position[0]+60+(j*53), position[1], "toggle"));
                }
                else {
                    attruiList[i].attrArgs.push(p.newdefault(position[0]+60+(j*53), position[1], "number"));
                }
            }
        }
    }
}

function removeAttributesObjects() {
    for (var obj in attruiList) {
        p.remove(attruiList[obj].attrName);
        for (var num in attruiList[obj].attrArgs) {
            p.remove(attruiList[obj].attrArgs[num]);
        }
    }
    attruiList = [];
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