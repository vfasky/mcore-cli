/**
 *
 * init app
 * @author vfasky <vfasky@gmail.com>
 **/
"use strict";
const fs = require('fs-plus');
const path = require('path');

let outPath = process.cwd();
let sourePath = path.join(__dirname, '../buildTpl');

fs.copySync(sourePath, outPath);
console.log('init mcore app done');
