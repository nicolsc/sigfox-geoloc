# Sigfox Geolocation example

Using the [Sigfox](http://makers.sigfox.com) geolocation service + openstreet map reverse geocoding feature to know the approx position of any device without any GPS

⚠️  Work in progress

Target :

* Press the [Sensit](http://sensit.io) button
* Trigger the SERVICE/GEOLOC callback on the [Sigfox Cloud](http://backend.sigfox.com)
* Receive the callback on this app
* Ask for reverse geocoding to OSM
* Send a SMS using Twilio with device info + location

Currently, just displays the geocoding info in the server logs
