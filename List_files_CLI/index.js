#!/usr/bin/env node

const fs = require('fs');
const util = require('util');
const chalk = require('chalk');
const path = require('path');

// 2nd Promise based method
// const lstat = util.promisify(fs.lstat);

// 3rd Promise based method
// const { lstat } = fs.promises;

const targetDir = process.argv[2] || process.cwd();  // adding additional param as directory

fs.readdir(targetDir, async (err, files) => {
  if (err) {
    throw new Error(err);
  }

  // Callback based method for listing 

  // const allStats = Array(files.length).fill(null);

  // for (let file of files) {
  //   const index = files.indexOf(file);

  //   fs.lstat(file, (err, stats) => {
  //     if (err) throw new Error(err);

  //     allStats[index] = stats;

  //     const ready = allStats.every((stats) => {
  //       return stats;
  //     });

  //     if (ready) {
  //       allStats.forEach((stats, i) => {
  //         console.log(files[i], stats.isFile())
  //       });
  //     }
  //   });
  // }


  // Promise solution

  // for (let file of files) {
  //   try {
  //     const stats = await lstat(file);

  //     console.log(file, stats.isFile());
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }


  // Promise.all solution

  const statPromises = files.map(file => lstat(path.join(targetDir, file)));

  const allStats = await Promise.all(statPromises);

  for (let stats of allStats) {
    const index = allStats.indexOf(stats);

    if (stats.isFile()) {
      console.log(chalk.yellow(files[index]))
    } else {
      console.log(chalk.blue(files[index]))
    }

  }
});


// 1st Promise based method

const lstat = (file) => {
  return new Promise((resolve, reject) => {
    fs.lstat(file, (err, stats) => {
      if (err) reject(err);

      setTimeout(() => resolve(stats), 500)
      // resolve(stats);
    })
  })
}

