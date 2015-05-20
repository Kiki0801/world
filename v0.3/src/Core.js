// 核心相关
w.ns("Core");

// 初始化
w.Core.init = function() {

    w.Map.init();
    w.Map.draw();
}

// 运行
w.Core.run = function() {
    
    var items   = w.Map.items,
        TYPE    = w.Const.TYPE,
        rand    = w.Util.rand,
        moved   = [],  // 已经移动过的
        pos,
        type,
        i,
        j;
     
    // grow
    for (i = 0; i < items.length; i++) {
        
        for (j = 0; j < items[i].length; j++) {
            
            // 生长
            items[i][j].grow();
            
            // 移动
            if (moved[i] && moved[i][j] === true) {
                
                console.log("   skip: " + i + ", " + j);///
                continue;
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
            bury    = w.Item.bury,
            items   = w.Map.items,
            pos = {
                x: 0,
                y: 0
            },
            index,
            env,
            target,
            tmp,
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
            
            console.log(item + " -> " + target);///
            
            // 移动
            items[ix][iy].moveTo(tx, ty);
            
            // 记录已经移动过的点
            pos.x = tx;
            pos.y = ty;
            
            /*
            
            // 吃掉
            if (target.currEnergy > 0) {
                
                items[ix][iy].currEnergy += target.currEnergy;
                console.log(item + " >> " + target);///
            }
            
            */
        }
        
        return pos;
    }
    
    // 重绘
    w.Map.draw();
}

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