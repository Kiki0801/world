// 调试相关
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
w.a = w.Debug.alert;