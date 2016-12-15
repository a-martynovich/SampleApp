var child_process = require('child_process');

function forkAndRestart(script) {
    child_process.fork(script) 
        .on('close', function(code) {
            console.log("Sender exited: code "+code);
            forkAndRestart();
        });
}
forkAndRestart('mailer.js');
forkAndRestart('web.js');