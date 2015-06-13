module.exports = function(grunt) {
    
    // 1.  定义任务
    grunt.initConfig({
        // 1.  读取package.json
        pkg: grunt.file.readJSON("package.json"),
        
        // 2.  初始化各个任务的配置对象
        // 合并文件
        concat: {
            options: {
                // 防止合并出错（上一个文件尾部少了分号）
                separator: ";",
                // 顶部信息（需要自带注释格式，不自动注释，也不自动换行）
                banner: "/*<%= pkg.name %>_<%= pkg.version %> " +
                        // *注意*：yyyy-mm-dd要加引号，表示字符串参数
                        "<%= grunt.template.today('yyyy-mm-dd') %>*/\r\n\r\n",
                // 底部信息
                footer: "\r\n\r\n/* author: http://ayqy.net/ */"
            },
            
            build: {
                src: ["src/w.js", "src/Debug.js", "src/Const.js", "src/Item.js", "src/Map.js", "src/Util.js", "src/Core.js"],
                dest: "build/<%= pkg.name %>.js"
            }
        },
        // 代码检查
        jshint: {
            options: {
                eqeqeq: true,   // 要求===
                trailing: true, // 要求尾部无空格
                //unused: true,   // 要求警告没用到的变量（模块化代码会报错）
                forin: true,    // 要求for-in必须有hasOwnProp过滤
                curly: true     // 要求花括号
            },
            
            files: ["Gruntfile.js", "src/*.js"]
        },
        // 代码瘦身
        uglify: {
            options: {
                // 不混淆变量名
                mangle: false,
                // 输出压缩率，可选的值有 false(不输出信息)，gzip
                report: "min",
                // 顶部信息（需要自带注释格式，不自动注释，也不自动换行）
                banner: "/*<%= pkg.name %>_<%= pkg.version %> " +
                        "<%= grunt.template.today('yyyy-mm-dd') %>*/\r\n\r\n",
                // 底部信息
                footer: "\r\n\r\n/* author: http://ayqy.net/ */"
            },
            
            build: {
                files: {
                    // <%= concat.dist.dest %>表示uglify会自动瘦身concat任务中生成的文件
                    "build/<%= pkg.name %>.min.js": ["<%= concat.build.dest %>"]
                }
            }
        },
        // 监听文件变动，自动执行任务
        watch: {
            files: ["<%= jshint.files %>"],
            tasks: ["default"]
        }
    });
    
    // 2.  加载插件
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");
    
    // 3.  注册任务
    grunt.registerTask("default", ["jshint", "concat", "uglify"]);  // 默认任务
    grunt.registerTask("check", ["jshint"]);    // 自定义任务：代码检查
};