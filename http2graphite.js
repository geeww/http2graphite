# http2graphite
# A simple HTTP listener, that accepts metrics from HTTP and sends them to graphite via UDP
# 
# HTTP query string
# http://<http2graphitehost>:<listenPort>?name=<metricName>&value=<metricValue[&timestamp=<timestamp>]
# timestamp is optional and will be generated at the time the metric is received if one is not specified
#
# Usage
# node http2graphite.js
#
sys = require("sys"),
http = require("http"),
dgram = require("dgram"),
buffer = require('buffer').Buffer,
url = require("url");

listenPort = 8080;
graphiteHost = "localhost";

var requestListener = function (request,response) {
        querystring = url.parse(request.url, true);

        //Parse our query string, if no timestamp given we'll create one
        if (querystring && querystring.query["name"] && querystring.query["value"]) {
                line = (querystring.query["name"] + " " + querystring.query["value"]);
                if (querystring.query["timestamp"]) {
                        line = (line + " " + querystring.query["timestamp"]);
                } else {
                        line = (line + " " + Math.round(new Date().getTime() / 1000.0));
                }
        }

        //Send the metric to graphite
        buffer = new Buffer(line);
        client = dgram.createSocket("udp4");
        client.send(buffer, 0, line.length, 2003, graphiteHost, function(err, bytes) { 
                if (err) {
                        throw err;
                }
        });
        response.writeHeader(200);  
        response.write("OK");
        response.end();
}
                                         
var server = http.createServer(requestListener);
server.listen(listenPort, "0.0.0.0");