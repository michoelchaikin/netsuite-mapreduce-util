const mv = require('mv');
const folderName = 'mru o5dYJbA1LN';
mv(
  'dist',
  `../sdf/src/FileCabinet/SuiteScripts/mapreduce-util/${folderName}`,
  function(err, succ) {
    if (err) console.log(err);
    else
      console.log('\nBuild completed!\nIn the sdf folder run "npm run deploy"');
  }
);
