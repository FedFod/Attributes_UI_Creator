function createAttrNameComment(position, attrName) {
    var attrNameComment = p.newobject("comment", position[0], position[1], 121, 15);
    // var attrNameComment = p.newdefault(position[0], position[1], "comment");
    attrNameComment.set(attrName);
    return attrNameComment;
}

function createOutlet(position) {
    var outlet = p.newdefault(position[0], position[1], "outlet");
    return outlet;
}

function createChooser(position, attrList) {
    var chooser = p.newdefault(position[0], position[1], "chooser");

    for (var i=0; i<attrList.length; i++) {
        print(attrList[i])
        chooser.message("append", attrList[i]);
    }
    return chooser;
}

function createBasicUIObj(objClass, position, val) {
    var argObj = (p.newdefault(position[0], position[1], objClass));
    var type = null;
    if (objClass == "flonum") {
        type = "float";
    } else if (objClass == "number" || objClass == "toggle") {
        type ="int";
    }
    argObj.message(type, val);
    argObj.value = val;
    argObj.width = argObj.rect[2]-argObj.rect[0];
    return argObj;
}

function createPanel(position, size, color) {
    var panel = p.newdefault(position[0], position[1], "panel");
    panel.rect = [position[0], position[1], size[0], size[1]];
    panel.message("bgfillcolor", color);
    p.sendtoback(panel);
    panel.message("sendtoback");
    return panel;
}

