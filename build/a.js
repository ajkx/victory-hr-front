var path = require('path');

function resolve (dir) {
    return path.join(__dirname, '..',dir)
}
console.log(__dirname);
console.log(resolve('src/assets'));