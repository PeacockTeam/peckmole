"use strict;"

$(function() {
    $("#hosts>li").live("click", function() {
	var host = $(this).text();

	console.log("get info about", host);

	$("#host").val(host);
	$("#push").click();
    });

    // Simply test

    $("#push").live("click", function() {
	var host = $("#host").val();

	host = "ws://" + parseUri(host)["authority"];

	$("#status").text("checking: " + host);

	// TODO: check for schema, add/remove/change it

	// TODO: use socket.io?
	//
	// ws locked if port closed/filtred for specific origin
	//
	// on close ws return:
	//
	// 'WebSocket is closed before the connection is established.'
	//
	// all listeners nulled before close socket, try/catch doesn't
	// work.
	//
	// After few minutes thire resolved.
	//
	// socket.io handle it by using other transport

	var ws = new WebSocket(host);

	var wood = function(event) {
	    $(document).trigger("peck", {
		event: event
	    });
	};

	ws.onerror = wood;
	ws.onclose = wood;
	ws.onopen = wood;
	ws.onmessage = wood;

	var timeout = setTimeout(function() {
	    wood({ type: "timeout" });
	}, 3000);

	window.currentSocket = ws;
	window.currentTimeout = timeout;
    });

    $(document).bind("peck", function(event, p) {
	var ws = currentSocket;
	var timeout = currentTimeout;

	clearTimeout(timeout);

	if (ws.readyState == ws.CLOSED
	    || ws.readyState == ws.CLOSING
	    || ws.readyState == ws.OPEN) {
	    $("#status").text("open");
	} else {
	    $("#status").text("closed or filtred");
	}

        ws.onopen = null;
        ws.onmessage = null;
        ws.onclose = null;
        ws.onerror = null;
	// XXX: WebSocket is closed before the connection is established.
	ws.close();
    });
})

// TODO:
peckmole = {
    hosts: function(cb) {
	$.get("/v1/", function(data) {
	    cb(data);
	});
    },

    ports: function(host, cb) {
	$.get("/v1/" + host, function(data) {
	    cb(data);
	});
    },

    setPort: function(host, port) {
	$.get("/v1/" + host + "/" + port);
    }
};


// from https://raw.github.com/LearnBoost/socket.io-client

var parseUri = function (str) {
    var re = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

    var parts = ['source', 'protocol', 'authority', 'userInfo', 'user', 'password',
		 'host', 'port', 'relative', 'path', 'directory', 'file', 'query',
		 'anchor'];

    var m = re.exec(str || '')
    , uri = {}
    , i = 14;

    while (i--) {
	uri[parts[i]] = m[i] || '';
    }

    return uri;
};
