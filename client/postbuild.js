const mv = require('mv');
const rimraf = require('rimraf');

const folderName = 'mru o5dYJbA1LN';
const folderPath = `../sdf/src/FileCabinet/SuiteScripts/mapreduce-util/${folderName}`;

rimraf(folderPath, () => {
  mv('dist', folderPath, function(err, succ) {
    if (err) console.log(err);
    else
      console.log('\nBuild completed!\nIn the sdf folder run "npm run deploy"');
  });
});
