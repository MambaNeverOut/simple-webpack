(function(modules){
        function exec(id){
            let [fn, mapping] = modules[id];
            let module = {exports:{}};
            fn && fn(require,exports,module);

            function require(path){
                return exec(mapping[path])
            }
            return module.exports
        }
        exec(0)
    })({0:[
            function(require, exports, module){    let module1 = require('./module1.js').name
    let module2 = require('./module2.js').name
    console.log(module1);
    console.log(module2);},
            {"./module1.js":1,"./module2.js":2}
        ],1:[
            function(require, exports, module){    let name = '我是模块1';

    exports.name = name},
            {}
        ],2:[
            function(require, exports, module){    let name2 = '我是模块2';
    let name3 = require('./module3.js').name;

    exports.name = `${name2}，${name3}`},
            {"./module3.js":3}
        ],3:[
            function(require, exports, module){    let name = '我是模块2引入的模块3';

    exports.name = name},
            {}
        ],})