/*world_0.4.0 2015-05-21*/

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
};;// 常量相关
w.ns("Const");

// 初始地图
w.Const.MAP = [
    "############################",
    "#c**   #    #     ***     ##",
    "#cc****            **      #",
    "#          #####           #",
    "## ****    #   #    ##     #",
    "###           ##  ***#     #",
    "#           ###  **  #     #",
    "#   ####                   #",
    "# * ##       *             #",
    "# ** #         **      ### #",
    "#    #          *          #",
    "############################"
];

// 类型 char ~ name
w.Const.TYPE = {
    "#": "Wall",
    " ": "Space",
    "*": "Grass",
    "c": "Fish"
};

// 规格
w.Const.SPEC = {
    WALL: {
        name: "Wall",
        tag: "#",
        life: NaN,
        step: 0,
        baseEnergy: 0,
        currEnergy: 0,
        fullEnergy: NaN,
        x: 0,
        y: 0
    },
    SPACE: {
        name: "Space",
        tag: " ",
        life: 0,
        step: 0,
        baseEnergy: 0,
        currEnergy: 0,
        fullEnergy: NaN,
        x: 0,
        y: 0
    },
    GRASS: {
        name: "Grass",
        tag: "*",
        life: 3,
        step: 0,
        baseEnergy: 2,
        currEnergy: 2,
        fullEnergy: 4,
        x: 0,
        y: 0
    },
    FISH: {
        name: "Fish",
        tag: "c",
        life: 7,
        step: 1,
        baseEnergy: 5,
        currEnergy: 5,
        fullEnergy: 10,
        x: 0,
        y: 0
    }
};;// 生物相关（规则）
w.ns("Item");

w.Item.bury = function(x, y) {
    
    w.Map.items[x][y] = w.Item.create("Space", x, y);
};

// 父类型
w.Item.Item = function(spec) {
    
    this.name = spec.name;              // 名字
    this.tag = spec.tag;                // 字符
    this.life = spec.life;              // 生命
    this.step = spec.step;              // 步幅
    this.baseEnergy = spec.baseEnergy;  // 基础能量
    this.currEnergy = spec.currEnergy;  // 当前能量
    this.fullEnergy = spec.fullEnergy;  // 能量上限
    this.x = spec.x;                    // 行
    this.y = spec.y;                    // 列
};
w.Item.Item.prototype.grow = function() {
    
    // empty function
};
// 移动到指定位置
w.Item.Item.prototype.moveTo = function(x, y) {
    
    var items   = w.Map.items,
        create  = w.Item.create,
        bury    = w.Item.bury,
        thisX   = this.x,
        thisY   = this.y,
        newItem,
        attr;
    
    // 创建新对象
    newItem = create(this.name, x, y);
    // 初始化属性
    for (attr in newItem) {
        
        if (Object.hasOwnProperty && newItem.hasOwnProperty(attr) &&
                attr !== "x" && attr !== "y") {
            
            newItem[attr] = this[attr];
        }
    }
    
    // 放到新位置
    items[x][y] = newItem;
    
    // bury原位置
    bury(thisX, thisY);
};
w.Item.Item.prototype.toString = function() {
    
    return this.name + "(" + this.x + ", " + this.y + ")";
};

// 墙，不可破坏的场景
w.Item.Wall = function(x, y) {
    
    var spec = w.Const.SPEC.WALL;
    spec.x = x;
    spec.y = y;
    
    w.Item.Item.call(this, spec);
};
w.Item.Wall.prototype = new w.Item.Item({
    // empty object
});

// 空间
w.Item.Space = function(x, y) {
    
    var spec = w.Const.SPEC.SPACE;
    spec.x = x;
    spec.y = y;
    
    w.Item.Item.call(this, spec);
};
w.Item.Space.prototype = new w.Item.Item({
    // empty object
});

// 草，自动生成，不能移动
w.Item.Grass = function(x, y) {
    
    var spec = w.Const.SPEC.GRASS;
    spec.x = x;
    spec.y = y;
    
    w.Item.Item.call(this, spec);
};
w.Item.Grass.prototype = new w.Item.Item({
    // empty object
});
w.Item.Grass.prototype.grow = function() {
    
    this.life--;        // 消耗生命
    if (this.life === 0) {
        
        // 死亡
        w.Item.bury(this.x, this.y);
        console.log(this + " passed away");///
    } else {
        
        this.currEnergy++;  // 增加能量
    }
};

// 鱼，食草动物，能移动，会饿死
w.Item.Fish = function(x, y) {

    var spec = w.Const.SPEC.FISH;
    spec.x = x;
    spec.y = y;
    
    w.Item.Item.call(this, spec);
};
w.Item.Fish.prototype = new w.Item.Item({
    // empty object
});
w.Item.Fish.prototype.grow = function() {
    
    this.life--;        // 消耗生命
    if (this.life === 0) {
        
        // 自然死亡
        w.Item.bury(this.x, this.y);
        console.log(this + " passed away");///
    } else {
        
        this.currEnergy--;  // 消耗能量
        if (this.currEnergy === 0) {
            
            // 饿死
            w.Item.bury(this.x, this.y);
            console.log(this + " starved to death");///
        }
        // TODO: 生孩子判断
        // TODO: 生孩子
    }
};

w.Item.create = function(type, x, y) {
    
    return new w.Item[type](x, y);
};;// 地图相关
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
};;// 工具函数相关
w.ns("Util");

// 生成随机数[min, max]
w.Util.rand = function(min, max) {

    var num;
    var maxEx = max + 2; // 扩大范围到[min, max + 2]，引入两个多余值替换min/max
    
    do{
    
        num = Math.round(Math.random() * (maxEx - min) + min);
        num--;
    } while (num < min || num > max);   // 范围不对，继续循环
    
    return num;
};;// 核心相关
w.ns("Core");

// 初始化
w.Core.init = function() {

    w.Map.init();
    w.Map.draw();
};

// 运行
w.Core.run = function() {
    
    var items   = w.Map.items,
        moved   = [],  // 已经移动过的
        pos,
        i,
        j;
     
    // grow
    for (i = 0; i < items.length; i++) {
        
        for (j = 0; j < items[i].length; j++) {
            
            // 移动
            if (moved[i] && moved[i][j] === true) {
                
                //console.log("   skip: " + i + ", " + j);///
                continue;
            } else {
                
                // 生长
                items[i][j].grow();
            }
            
            pos = move(items[i][j]);
            
            //console.log("  current i,j: " + i + ", " + j);///
            //console.log("  should skip: " + pos.x + ", " + pos.y);///
            
            moved[pos.x] = [];
            moved[pos.x][pos.y] = true;
        }
    }
    
    function move(item) {
        
        var rand    = w.Util.rand,
            items   = w.Map.items,
            pos = {
                x: 0,
                y: 0
            },
            index,
            env,
            target,
            ix, // item.x
            iy, // item.y
            tx, // target.x
            ty, // target.y
            i;
        
        //console.log(item.name);///
        if (item.step !== 0) {  // 判断能否移动
            
            // 获取周围环境
            env = getEnv(item);
            for (i = 0; i < env.length; i++) {
                
                if (env[i].name === "Wall") {  // 去掉墙
                    
                    env.splice(i--, 1);
                }
            }
            // 随机终点
            index = rand(0, env.length - 1);
            target = env[index];
            ix = item.x;
            iy = item.y;
            tx = target.x;
            ty = target.y;
            
            console.log(item);///
            console.log(item + " -> " + target);///
            console.log(target);///
            
            // 移动
            items[ix][iy].moveTo(tx, ty);
            
            // 记录已经移动过的点
            pos.x = tx;
            pos.y = ty;
            
            // TODO: 吃掉
        }
        
        return pos;
    }
    
    // 重绘
    w.Map.draw();
};

// 返回周围环境（上下左右）
function getEnv(item) {

    var items = w.Map.items,
        res = [],
        i,
        j;
        
    for (i = item.x - 1; i <= item.x + 1; i++) {
        
        for (j = item.y - 1; j <= item.y + 1; j++) {
            
            if (!(i === item.x && j === item.y)) {   // 除去自己
                
                // 防止超出边界
                if (items[i] && items[i][j] instanceof w.Item.Item) {
                    
                    res.push(items[i][j]);
                }
            }
        }
    }

    return res;
}
/*

before: Space(7, 21), Space(8, 21) Core.js:85
after: Space(8, 21), Space(7, 20) Core.js:95
Space(7, 20)->Space(8, 21) 
*/

/* author: http://ayqy.net/ */