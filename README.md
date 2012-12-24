http2graphite
=============

http2graphite
A simple HTTP listener, that accepts metrics from HTTP and sends them to graphite via UDP

HTTP query string
http://<http2graphitehost>:<listenPort>?name=<metricName>&value=<metricValue[&timestamp=<timestamp>]
timestamp is optional and will be generated at the time the metric is received if one is not specified

Usage
node http2graphite.js