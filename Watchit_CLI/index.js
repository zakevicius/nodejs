#!/usr/bin/env node

const fs = require("fs");
const util = require("util");
const chokidar = require("chokidar");
const debounce = require("lodash.debounce");
const program = require("caporal");
const { spawn } = require("child_process");

const access = util.promisify(fs.access);

// const access = (name) => {
//   return new Promise((resolve, reject) => {
//     fs.access(name, err => {
//       if (err) return reject(err);
//       resolve();
//     })

//   })
// }

program
  .version('0.0.1')
  .argument('[filename]', 'Name of a file to execute')
  .action(async ({ filename }) => {
    const name = filename || "index.js";

    try {
      await access(name);
    } catch (err) {
      throw new Error(`File "${name}" was not found`);
    }

    const start = debounce(() => {
      spawn('node', [name], { stdio: 'inherit' });
    }, 300);

    chokidar
      .watch('.')
      .on("add", start)
      .on("change", start)
      .on("unlink", start);
  });

program.parse(process.argv);

