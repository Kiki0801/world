// 工具函数相关
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
}