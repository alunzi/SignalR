﻿//hitMe / hitUs : sends the server the current timestamp and the number of calls to make back to the client.  hitMe: just the callign client, hitUs: all clients on the hub.
//stepOne / stepAll : increments a counter
//doneOne / doneAll : prints # of messages and total duration.

$(function () {
    function log(message) {
        var $newMessage = $("<li/>", { text: message });
        $("#messages").prepend($newMessage);
        return $newMessage;
    };

    var bench = $.connection.hubBench,
                countOne = 0,
                countAll = 0;

    bench.stepOne = function () {
        ++countOne;
    };

    bench.doneOne = function (start, expected) {
        var duration = new Date().getTime() - start;
        var $msg = log(countOne + " in " + duration + "ms");
        if (expected != countOne) {
            $msg.css('color', 'red');
        }

        countOne = 0;
    };

    bench.stepAll = function () {
        ++countAll;
    };

    bench.doneAll = function (start, expected, numConnections) {
        var duration = new Date().getTime() - start;
        var $msg = log(countAll + " in " + duration + "ms.  " + numConnections + " connections");
        if (expected != countAll) {
            $msg.css('color', 'red');
        }
        countAll = 0;
    };

    $.connection.hub.start(options, function () { log("connected"); });

    //benchmark messages to just me
    $("#hitme").click(function () {
        var numCalls = parseInt($("#clientCalls").val());
        var now = new Date().getTime();
        bench.hitMe(now, numCalls, $.connection.hub.id);
    });

    //benchmark messages to all clients
    $("#hitus").click(function () {
        var numCalls = parseInt($("#clientCalls").val());
        var now = new Date().getTime();
        bench.hitUs(now, numCalls);
    });
});