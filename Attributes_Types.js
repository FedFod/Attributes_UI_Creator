function fillUmenu(attrName, obj) {
    obj.items = umenuAttributes[attrName]
    for (var i=0; i<umenuAttributes[attrName].length; i++) {
        obj.message("append", umenuAttributes[attrName][i]);
    }
}

function minAndMaxObj(obj, attrName) {
    if (toMinAndMax.hasOwnProperty(attrName)) {
        obj.message("min", toMinAndMax[attrName][0]);
        obj.message("max", toMinAndMax[attrName][1]);
    } 
}

var umenuAttributes = {
    animmode: ["local", "world", "parent"],
    blend: ["add", "multiply", "screen", "exclusion", "colorblend", "alphablend", "coloradd", "alphadd"],
    point_mode: ["square", "circle", "square_depth", "circle_depth", "user_shader"],
    shape: ["sphere", "torus", "cylinder", "opencylinder", "cube", "opencube", "plane", "circle", "cone", "capsule"],
    cull_face: ["0: Off", "1: Back", "2: Front", "3: 2Pass"]
}

var integerAttributes = ["blend_mode", "dim", "layer"];

var singleNumberAttributes = ["layer"];

var transforms = ["position", "scale", "rotatexyz", "rotate", "anchor"];

var toMinAndMax = {
    color: [0, 1],
    aux_color: [0, 1],
    gl_color: [0, 1000]
}
 