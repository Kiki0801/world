// 地图相关
w.ns("Map");

w.Map.items = [];

// 根据字符数组生成对象数组
w.Map.init = function() {
    
    var arr     = w.Const.MAP,
        TYPE    = w.Const.TYPE,
        items     = w.Map.items,
        Item    = w.Item,
        row,
        item,
        i,
        j;
    
    for (i = 0; i < arr.length; i++) {
        
        row = [];
        for (j = 0; j < arr[i].length; j++) {
            
            item = Item.create(TYPE[arr[i].charAt(j)], i, j);
            row.push(item);
        }
        items.push(row);
    }
    //w.c(items);///
};

w.Map.toString = function() {

    var items = w.Map.items,
        msg = [],
        row,
        i,
        j;
    
    for (i = 0; i < items.length; i++) {
        
        row = [];
        for (j = 0; j < items[i].length; j++) {
            
            row.push(items[i][j].tag);
        }
        msg.push(row.join(""));
    }
    
    return msg.join("\n");
};

w.Map.draw = function() {

    console.log(w.Map.toString());
    // 输出统计信息
    var counter = {};
    var items = w.Map.items;
    for (var i = 0; i < items.length; i++) {
        for (var j = 0; j < items[i].length; j++) {
            counter[items[i][j].name] || (counter[items[i][j].name] = 0);
            counter[items[i][j].name]++;
        }
    }
    console.log("fish: " + (counter["Fish"] || 0) + " grass: " + (counter["Grass"] || 0));
};