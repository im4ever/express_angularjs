/**
 * Created by qufan on 2015/7/9 0009.
 */
/**
 * Created by qufan on 2015/6/7 0007.
 * 多核执行脚本，提升性能
 */
var util = require('util');
var path = require('path');
var config = require('./config/config');

if(config.enableCluster){
    var workerpath = path.join(__dirname, 'server.js');
    var cluster = require('cluster');
    var restartTime = 5000;

    cluster.setupMaster({
        exec : workerpath
    });

    cluster.on('fork', function (worker) {
        console.log('[%s] [worker:%d] new worker start', new Date(), worker.process.pid);
    });

    cluster.on('exit', function (worker, code, signal) {

        var exitCode = worker.process.exitCode;
        var err = new Error(util.format('worker %s died (code: %s, signal: %s)', worker.process.pid, exitCode, signal));
        err.name = 'WorkerDiedError';
        //报警

        // restart
        setTimeout(function () {
            cluster.fork();
        }, restartTime);
    });

    var numCPUs = require('os').cpus().length;
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

}else{
    require('./server');
}

console.log('[%s] [master:%d] Server started, listen at %d, cluster: %s',
    new Date(), process.pid, config.port, config.enableCluster);