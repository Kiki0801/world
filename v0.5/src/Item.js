// 生物相关（规则）
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
};