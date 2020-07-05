const mv = require('mv')
const rimraf = require('rimraf')
const folderName = 'client'

rimraf(`../sdf/src/FileCabinet/SuiteScripts/mapreduce-util/${folderName}`, () => {
	mv('dist', `../sdf/src/FileCabinet/SuiteScripts/mapreduce-util/${folderName}`, function (err, succ) {
		if (err) console.log(err)
		else console.log('\nBuild completed!\nIn the sdf folder run "npm run deploy"')
	})
})
