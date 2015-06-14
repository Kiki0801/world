/*world_0.4.0 2015-06-14*/

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
};;// 调试相关
w.ns("Debug");

// 是否开启debug
w.Debug.on = false;

// console
w.Debug.console = function(obj) {
    if (w.Debug.on) {
        console.log(obj);
    }
};

// alert
w.Debug.alert = function(str) {
    if (w.Debug.on) {
        alert(str);
    }
}

// 简写
w.c = w.Debug.console;
w.a = w.Debug.alert;;// 常量相关
w.ns("Const");

// 初始地图
w.Const.MAP = [
    "############################",
    "#c**   #  * #     ***  **c##",
    "#  **** *   **c    *** c   #",
    "#     c    #####       *   #",
    "## ****    # c #    ##   c #",
    "### *      *  ##  ***#     #",
    "#   *c   *  ###  **  #*  * #",
    "#   ####          *    *   #",
    "# * ## *     *    **    *  #",
    "#*** # c ***   **  *  *### #",
    "#*   #*  *  c * *  *     **#",
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
        fullEnergy: 8,
        x: 0,
        y: 0
    }
};;// 生物相关（规则）
w.ns("Item");

w.Item.bury = function(x, y) {
    
    w.Map.items[x][y] = w.Item.create("Space", x, y);
};

w.Item.beget = function(parent, x, y) {
    var items   = w.Map.items,
        create  = w.Item.create;

    // 创建孩子
    var child = create(parent.name, x, y);
    // 放到指定位置
    items[x][y] = child;
    // 父亲消耗能量
    parent.currEnergy -= parent.baseEnergy;
}

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
        attr,
        energy;
    
    // 创建新对象
    newItem = create(this.name, x, y);
    // 初始化属性
    for (attr in newItem) {
        
        if (Object.hasOwnProperty && newItem.hasOwnProperty(attr) &&
                attr !== "x" && attr !== "y") {
            
            newItem[attr] = this[attr];
        }
    }
    // 修改属性
    energy = items[x][y].currEnergy;
    if (energy > 0) {
        // 吃掉
        newItem.currEnergy += energy;
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

    var items = w.Map.items,
        rand = w.Util.rand,
        beget = w.Item.beget,
        moved = [], // 已经移动过的
        env,
        index,
        pos,
        i,
        j,
        k;

    // grow
    for (i = 0; i < items.length; i++) {

        for (j = 0; j < items[i].length; j++) {

            // 移动
            if (moved[i] && moved[i][j] === true) {

                // w.c("   skip: " + i + ", " + j);///
                continue;
            }

            // 生长
            items[i][j].grow();
            // 生物生孩子（除了草还有上一轮没有空间生孩子的鱼）
            if (items[i][j].life > 0 &&
                items[i][j].currEnergy >= items[i][j].fullEnergy) {

                // w.c(items[i][j].name + ", " + items[i][j].life + ", " + items[i][j].currEnergy + ", " + items[i][j].fullEnergy); ///

                // 获取周围环境
                env = getEnv(items[i][j]);

                for (k = 0; k < env.length; k++) {

                    if (env[k].name !== "Space") { // 去掉墙和其它生物

                        env.splice(k--, 1);
                    }
                }

                if (env.length > 0) {
                    index = rand(0, env.length - 1);

                    // w.c("grow beget{"); ///
                    // w.c(items[i][j]); ///

                    beget(items[i][j], env[index].x, env[index].y);

                    // w.c(items[env[index].x][env[index].y]); ///
                    // w.c("}"); ///
                }
            }

            pos = move(items[i][j]);

            //w.c("  current i,j: " + i + ", " + j);///
            //w.c("  should skip: " + pos.x + ", " + pos.y);///

            // 记录已经移动过的点，下次跳过
            if (pos.x !== -1 && pos.y !== -1) {
                if (Object.prototype.toString.call(moved[pos.x]) !== "[object Array]") {
                    moved[pos.x] = [];
                }
                moved[pos.x][pos.y] = true;

// 调试
                // w.c("log: " + pos.x + ", " + pos.y);///
            }
        }
    }

    /**
     * 移动
     * @param  {Item} item 需要移动的Item
     * @return {Point} pos (-1, -1)表示Item未移动
     */
    function move(item) {

        var rand = w.Util.rand,
            items = w.Map.items,
            beget = w.Item.beget,
            pos = {
                x: -1,
                y: -1
            },
            index = -1,
            env,
            target,
            ix, // item.x
            iy, // item.y
            tx, // target.x
            ty, // target.y
            i;

        //w.c(item.name);///
        if (item.step !== 0) { // 判断能否移动

            // 获取周围环境
            env = getEnv(item);
            for (i = 0; i < env.length; i++) {

                if (env[i].name === "Wall" ||
                        env[i].name === item.name) { // 去掉墙、同类

                    env.splice(i--, 1);
                }
            }
            // 随机终点
            if (env.length === 0) {
                /* 出口，动不了 */
                return;
            }
            // 优先向有食物的地方移动
            for (i = 0; i < env.length; i++) {

                if (env[i].name === "Grass") { // 找食物

                    index = i;
                    break;
                }
            }
            // 没有食物就随机移动
            if (index === -1) {
                index = rand(0, env.length - 1);
            }
            target = env[index];
            ix = item.x;
            iy = item.y;
            tx = target.x;
            ty = target.y;

            // w.c(item);///
            // w.c(item + " -> " + target); ///
            // w.c(target);///

            // 移动
            items[ix][iy].moveTo(tx, ty);

            // w.c(items[tx][ty]); ///

            // 生孩子
            // 获取新的周围环境
            env = getEnv(items[tx][ty]);
            for (i = 0; i < env.length; i++) {

                if (env[i].name !== "Space") { // 去掉墙和其它生物

                    env.splice(i--, 1);
                }
            }
            if (env.length > 0) {
                index = rand(0, env.length - 1);
                if (items[tx][ty].currEnergy >= items[tx][ty].fullEnergy && env.length > 0) {
                    // w.c("hunt beget{"); ///
                    // w.c(items[tx][ty]); ///

                    beget(items[tx][ty], env[index].x, env[index].y);

                    // w.c(items[env[index].x][env[index].y]); ///
                    // w.c("}"); ///
                }
            }
            
            // 记录已经移动过的点
            pos.x = tx;
            pos.y = ty;
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

            if (!(i === item.x && j === item.y)) { // 除去自己

                // 防止超出边界
                if (items[i] && items[i][j] instanceof w.Item.Item) {

                    res.push(items[i][j]);
                }
            }
        }
    }

    return res;
}


/* author: http://ayqy.net/ */