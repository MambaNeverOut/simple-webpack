    let name2 = '我是模块2';
    let name3 = require('./module3.js').name;

    exports.name = `${name2}，${name3}`