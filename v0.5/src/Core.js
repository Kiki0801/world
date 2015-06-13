// 核心相关
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

                //w.c("   skip: " + i + ", " + j);///
                continue;
            } else {

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

                    if (env.length === 0) {
                        /* 出口，没地方生 */
                        return;
                    }
                    index = rand(0, env.length - 1);

                    w.c("grow beget{"); ///
                    w.c(items[i][j]); ///

                    beget(items[i][j], env[index].x, env[index].y);

                    w.c(items[env[index].x][env[index].y]); ///
                    w.c("}"); ///
                }
            }

            pos = move(items[i][j]);

            //w.c("  current i,j: " + i + ", " + j);///
            //w.c("  should skip: " + pos.x + ", " + pos.y);///

            // 记录已经移动过的点，下次跳过
            moved[pos.x] = [];
            moved[pos.x][pos.y] = true;
        }
    }

    function move(item) {

        var rand = w.Util.rand,
            items = w.Map.items,
            beget = w.Item.beget,
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
            index = rand(0, env.length - 1);
            target = env[index];
            ix = item.x;
            iy = item.y;
            tx = target.x;
            ty = target.y;

            // w.c(item);///
            w.c(item + " -> " + target); ///
            // w.c(target);///

            // 移动
            items[ix][iy].moveTo(tx, ty);

            w.c(items[tx][ty]); ///

            // 生孩子
            // 获取新的周围环境
            env = getEnv(items[tx][ty]);
            for (i = 0; i < env.length; i++) {

                if (env[i].name !== "Space") { // 去掉墙和其它生物

                    env.splice(i--, 1);
                }
            }
            if (env.length === 0) {
                /* 出口，没地方生 */
                return;
            }
            index = rand(0, env.length - 1);
            if (items[tx][ty].currEnergy >= items[tx][ty].fullEnergy && env.length > 0) {
                w.c("hunt beget{"); ///
                w.c(items[tx][ty]); ///

                beget(items[tx][ty], env[index].x, env[index].y);

                w.c(items[env[index].x][env[index].y]); ///
                w.c("}"); ///
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
