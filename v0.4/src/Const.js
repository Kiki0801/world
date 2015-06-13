// 常量相关
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
};