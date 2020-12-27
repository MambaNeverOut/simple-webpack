// 实现原理
modules = {
    0: function(require, exports, module) {
        let name1 = require('./src/module1.js').name;
        let name2 = require('./src/module2.js').name;
        let message = name1 + ',' + name2;
        console.log(message);
    },
    1: function(require, exports, module) {
        exports.name = '我是模块1'
    },
    2: function(require, exports, module) {
        let name3 = require('./src/module3.js')
        exports.name = `我是模块2,${name3}`
    },
    3: function(require, exports, module) {
        exports.name = '我是模块2引入的模块3'
    },
}

function exec(id) {
    let fn = module[id]
    let exports = {}
    fn(require, exports)

    function require(path) {
        // 读取模块路径，返回模块执行的结果
    }
}
exec(0)



// 资源映射和启动入口

modules = {
    0: [function(require, exports, module) {
            let name1 = require('./src/module1.js').name;
            let name2 = require('./module2.js').name;
            let message = name1 + ',' + name2;
            console.log(message);
        },
        {
            '.module1.js': 1,
            '.module2.js': 2,
        }
    ],
    1: [function(require, exports, module) {
        exports.name = '我是模块1'
    }, {}],
    2: [function(require, exports, module) {
        let name3 = require('./src/module3.js')
        exports.name = `我是模块2，${name3}`
    }, {
        '.module3.js': 3
    }],
    3: [function(require, exports, module) {
        exports.name = '我是模块2引入的模块3'
    }, {}]
}

function exec(id) {
    let [fn, mapping] = modules[id]
    let exports = {}
    fn & fn(require, exports)

    function require(path) {
        return exec(mapping[path])
    }
    return exports
}

exec(0)