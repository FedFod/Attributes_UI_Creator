function Interface(pos) {
    this.pos = pos.slice();
    this.ui = {};
    this.updatedPos = this.pos.slice();
    this.blockSize = [0,0];
    this.receiverName = "";
    this.outlet = null; 
    this.verticalOffset = 21;
    this.interfaceName = null;
    this.panelColor = [0.2,0.2,0.2,0.2];

    this.interfacesDict = new Dict("interfacesDict");
	this.interfacesDict.import_json("Interfaces.json");

    this.setVarName = function(varname) {
        this.interfaceName = varname;
        print("interface varname "+this.varName)
    }

    this.initInterface = function(interfaceClass, varName) {
        // this.outlet = createOutlet([ jsthis.rect[0], jsthis.rect[1]+100 ]);
        this.addMenuArrow();
        this.addInterfaceTitle(interfaceClass);
        this.parseInterfaceFromJSON(interfaceClass);
        this.addPanel();
        // this.connectThisJSToOutlet();
        // this.ui["outlet"] = (this.outlet);
        this.setVarName(varName);
        globalObj.size = this.blockSize;
    }

    this.addInterfaceTitle = function(interfaceClass) {
        this.ui["title"] = createAttrNameComment(this.updatedPos, interfaceClass);
        this.updatedPos[1] += this.verticalOffset;
        this.ui["title"].message("fontface", "bold");
    }

    this.addMenuArrow = function() {
        var newPos = this.updatedPos.slice();
        newPos[0] += 80;
        this.ui["menuArrow"] = createBasicUIObj("toggle", newPos, 0);
        this.addListenerToElement(this.ui["menuArrow"], menuArrowCallback);
    }

    this.parseInterfaceFromJSON = function(interfaceClass) {
        var interfaceBlocks = this.interfacesDict.get(interfaceClass);
        var blockEntries = interfaceBlocks.getkeys();

        if (Array.isArray(blockEntries)) {
            for(var entry in blockEntries) {
                var attrName = blockEntries[entry];
                if (attrName == "interface_color") {
                    this.panelColor = interfaceBlocks.get(attrName);
                    print("PANEL COLOR "+this.panelColor)
                } else 
                {
                    var valuesArray = interfaceBlocks.get(attrName);

                    print("VA "+valuesArray)
                    if (Array.isArray(valuesArray)) {
                        var attrType = valuesArray[0];
                        var nAttrs = valuesArray.length;
                        print("nattrs "+nAttrs)
                        this.addUIBlock(attrName, nAttrs, attrType);
                    } else {
                        this.addUIBlock(attrName, 1, valuesArray);
                    }
                }
    
            }
        }
        print("blockentries "+blockEntries)
    }

    this.moveInterface = function(pos) {
        for (var elem in this.ui) {
            var uiBlock = this.ui[elem];
            var currRect = uiBlock.rect.slice();
            uiBlock.message("patching_position", pos[0]+currRect[0], pos[1]+currRect[1]);
        }
    }

    this.addUIBlock = function(attrName, nElements, type) {
        var valuesOffset = 5;
        var bottomOffset = 10;

        this.ui[attrName+"_comment"] = (createAttrNameComment(this.updatedPos, attrName));
        this.ui[attrName+"_comment"].hidden = 1;

        var uiBlockElements = [];

        this.updatedPos[1] += this.verticalOffset;
        var tempPos = this.updatedPos.slice();

        for (var i=0; i<nElements; i++) {
            uiBlockElements.push(createBasicUIObj(type, tempPos, 0.0));
            var newElement = uiBlockElements[i];
            newElement.hidden = 1;
            newElement.index = i;
            newElement.attrName = attrName;
            this.addListenerToElement(newElement, elementCallbackFun);

            tempPos[0] += uiBlockElements[i].width+valuesOffset;
            this.blockSize[0] = tempPos[0];
        }
        this.updatedPos[1] += 20;
        this.blockSize[1] = this.updatedPos[1]+bottomOffset;
        this.blockSize[0] = Math.max(this.blockSize[0], 130);

        this.ui[attrName] = uiBlockElements;        
    }

    this.addListenerToElement = function(element, fun) {
        element.listener = new MaxobjListener(element, fun);
    }

    this.connectThisJSToOutlet = function() {
        p.connect(jsthis, 0, this.outlet, 0);
    }

    this.showInterface = function() {
        for (var uiBlock in this.ui) {
            if ( Array.isArray(this.ui[uiBlock])) {
                for (var element in this.ui[uiBlock]) {
                    this.ui[uiBlock][element].hidden = 0;
                }
            } else {
                this.ui[uiBlock].hidden = 0;
            }
        }
    }

    this.addPanel = function() {
        this.ui["panel"] = createPanel([this.pos[0]-5, this.pos[1]], [this.blockSize[0],this.updatedPos[1]+10], this.panelColor);
    }

    this.destroyInterface = function() {
        for (var uiBlock in this.ui) {
            if ( Array.isArray(this.ui[uiBlock])) {
                for (var element in this.ui[uiBlock]) {
                    p.remove(this.ui[uiBlock][element]);
                }
            } else {
                p.remove(this.ui[uiBlock]);
            }
        }
        gc();
        this.ui = {};
    }
}

// **********************************

function menuArrowCallback(data) {
    var interName = (interface.interfaceName);
    var origSize = globalObj.interfaceGenerator.interfaces[interName].origSize;
    var currRect = globalObj.interfaceGenerator.interfaces[interName].rect;
    if (data.value) {
        globalObj.interfaceGenerator.interfaces[interName].rect = [currRect[0], currRect[1], currRect[2], currRect[1]+26];
    } else {
        globalObj.interfaceGenerator.interfaces[interName].rect = [currRect[0], currRect[1], currRect[2], currRect[1]+origSize[1]];
    }
}

function elementCallbackFun(data) {
    messnamed("attrReceiver", [ data.maxobject.attrName, data.value ]);
    var arrayOfObjs = interface.ui[data.maxobject.attrName];
    var thisObj = arrayOfObjs[data.maxobject.index];
    thisObj.value = data.value;
    var output = [];
    output.push(data.maxobject.attrName);
    for (var obj in arrayOfObjs) {
        output.push(arrayOfObjs[obj].value);
    }
    outlet(0, output);
}