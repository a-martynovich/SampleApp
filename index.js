// authorized emails:
// artem.martynovich@gmail.com
// alt.xk-6c1gf9c@yopmail.com  artem-test-app-1

var child_process = require('child_process');

function forkAndRestart(script) {
    child_process.fork(script) 
        .on('close', function(code) {
            console.log("Sender exited: code "+code);
            setTimeout(function() {
                forkAndRestart(script);
            }, 1000);
        });
}
forkAndRestart('mailer.js');
forkAndRestart('web.js');