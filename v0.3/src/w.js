// 顶级命名空间：World
var w = {

    /*
     * 创建/获取子命名空间，支持链式调用
     */
    ns: function(ns) {
        var parts = ns.split("."),
            object = this,
            i, len;
 
        for (i = 0, len = parts.length; i < len; i++) {
            if (!object[parts[i]]) {
                object[parts[i]] = {};
            }
            object = object[parts[i]];
        }
 
        return object;  // 支持链式调用
    }
}