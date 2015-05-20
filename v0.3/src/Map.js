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
    //console.log(items);///
}

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
}

w.Map.draw = function() {

    console.log(w.Map.toString());
}