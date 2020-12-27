// 依赖解析和创建资源对象
/*
const fs = require('fs');
let ID = 0

function getDependencies(str) { // 获取require引入的模块路径
    let reg = /require\(['"](.+?)['"]\)/g
    let result = null
    let dependencies = []
    while (result = reg.exec(str)) {
        dependencies.push(result[1])
    }
    return dependencies
}

function createAsset(filename) {
    let fileContent = fs.readFileSync(filename, 'utf-8')
    const id = ID++;
    return {
        id: id,
        filename: filename,
        dependencies: getDependencies(fileContent),
        code: `function(require, exports, module){${fileContent}}`
    }
}

let result = createAsset('./src/index.js')
console.log(result);
*/

// 新增createGraph函数

// const fs = require('fs')
// const path = require('path')

// let ID = 0

// function getDependencies(str) {
//     let reg = /require\(['"](.+?)['"]\)/g
//     let result = null
//     let dependencies = []
//     while (result = reg.exec(str)) {
//         dependencies.push(result[1])
//     }
//     return dependencies
// }

// function createAsset(filename) {
//     let fileContent = fs.readFileSync(filename, 'utf-8')
//     const id = ID++;
//     return {
//         id: id,
//         filename: filename,
//         dependencies: getDependencies(fileContent),
//         code: `function(require, exports, module){${fileContent}}`
//     }
// }

// function createGraph(filename) {
//     let asset = createAsset(filename);
//     let queue = [asset];

//     for (let asset of queue) {
//         const dirname = path.dirname(asset.filename);
//         asset.mapping = {};
//         asset.dependencies.forEach(relativePath => {
//             const absolutePath = path.join(dirname, relativePath);
//             const child = createAsset(absolutePath);
//             asset.mapping[relativePath] = child.id;
//             queue.push(child);
//         });
//     }
//     return queue;
// }


// let result = createGraph('./src/index.js')
// console.log(result);


// 生成理论中需要的对象

const fs = require('fs')
const path = require('path')

let ID = 0

function getDependencies(str) {
    let reg = /require\(['"](.+?)['"]\)/g
    let result = null
    let dependencies = []
    while (result = reg.exec(str)) {
        dependencies.push(result[1])
    }
    return dependencies
}

function createAsset(filename) {
    let fileContent = fs.readFileSync(filename, 'utf-8')
    const id = ID++;
    return {
        id: id,
        filename: filename,
        dependencies: getDependencies(fileContent),
        code: `function(require, exports, module){${fileContent}}`
    }
}

function createGraph(filename) {
    let asset = createAsset(filename);
    let queue = [asset];

    for (let asset of queue) {
        const dirname = path.dirname(asset.filename);
        asset.mapping = {};
        asset.dependencies.forEach(relativePath => {
            const absolutePath = path.join(dirname, relativePath);
            const child = createAsset(absolutePath);
            asset.mapping[relativePath] = child.id;
            queue.push(child);
        });
    }
    return queue;
}

function createBundle(graph) {
    let modules = ''


    graph.forEach(mod => {
        modules += `${mod.id}:[
            ${mod.code},
            ${JSON.stringify(mod.mapping)}
        ],`
    })

    const result = `(function(modules){
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
    })({${modules}})`

    // fs.writeFileSync('../dist/bundle.js', result) // 在simple-webpack目录下使用这行代码
    fs.writeFileSync('./dist/bundle.js', result) // 在根目录下使用这行代码
}
// node.js readFileSync 导致的问题
// let graph = createGraph('./src/index.js'); // 在simple-webpack目录下使用这行代码
let graph = createGraph('./simple-webpack/src/index.js'); // 在根目录下使用这行代码
createBundle(graph)