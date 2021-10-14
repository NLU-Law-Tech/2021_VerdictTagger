var sys = require('util');
var exec = require('child_process').exec;
var os = require('os');

// Run command depending on the OS
if (os.type() === 'Linux') 
   exec("npm run dist-mac"); 
else if (os.type() === 'Darwin') 
   exec("npm run dist-mac"); 
else if (os.type() === 'Windows_NT') 
   exec("npm run dist-win");
else
   throw new Error("Unsupported OS found: " + os.type());