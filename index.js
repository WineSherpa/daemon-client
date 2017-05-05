const ipc = require('node-ipc');
const readline = require('readline');

var rl = readline.createInterface({input: process.stdin, output: process.stdout});
ipc.config.silent = true;
ipc.config.maxRetries = 0;

ipc.connectToNet('world', function () {
	ipc.of.world.on('message', function(data, socket) {
		var t = Math.ceil((rl.line.length + 3) / process.stdout.columns);
		rl.output.write("\n\x1B[" + t + "A\x1B[0J");
		rl.output.write(data+'\n');
		rl.output.write(Array(t).join("\n\x1B[E"));
		rl._refreshLine();
	});
});

rl.setPrompt('> ', 2);
rl.on("line", function(value){
	value = value.split(' ');
	if (value[0] != '') {
		ipc.of.world.emit('command', {command:value.shift(), params:value});
	}
	rl.prompt();
});
rl.prompt();
