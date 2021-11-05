function BPatcherGenerator() {
    this.interfaces = {};

    this.createInterface = function(interfaceClass, pos) {
        print(interfaceClass)
        var varname = interfaceClass+"_"+Math.floor(Math.random()*100);
        var newInterface = pp.newdefault(pos[0], pos[1], "bpatcher", "interfaces_generator.maxpat", "@args", 
                            [interfaceClass, varname]);
        newInterface.varname = varname;
        // newInterface.size = globalObj[interfaceClass].size;
        print("size "+globalObj.size)
        this.interfaces[varname] = newInterface;
    }

    this.destroyInterfaces = function() {
        for (var inter in this.interfaces) {
            pp.remove(this.interfaces[inter]);
        }
        this.interfaces = {};
    }

    this.moveNewestInterface = function(delta) {
        var keys = Object.keys(this.interfaces);
        var latestUI = this.interfaces[keys[keys.length-1]];
        var currPos = [latestUI.rect[0], latestUI.rect[1]];
        latestUI.rect = [currPos[0]+delta[0], currPos[1]+delta[1], currPos[0]+globalObj.size[0], currPos[1]+globalObj.size[1]];
        latestUI.origSize = globalObj.size.slice();
    }

    this.showNewestInterface = function() {
        // this.interfaces[this.interfaces.length-1].showInterface();
    }
}

