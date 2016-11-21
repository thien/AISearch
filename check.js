var fs = require('fs');
var exec = require('child_process').exec;

module.exports = {
  runCheck: function () {
      function puts(error, stdout, stderr) {
      	console.log(stdout);
      }
      console.log("Running Python Check");
      exec("python validtourcheck.py", puts);
      console.log(fs.readFileSync("trace.txt", 'utf8'));
  }
};
