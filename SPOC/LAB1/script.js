const mymap = L.map('sample_map').setView([40.741, -3.884], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
  maxZoom: 18
}).addTo(mymap);

var marker;

const watchID = navigator.geolocation.watchPosition(function (position) { 
  var latitud = position.coords.latitude;
  var longitud = position.coords.longitude;
  
  mymap.setView([latitud, longitud], 20);

  if (marker){
    marker.setLatLng([latitud, longitud]);
  }
  else{
    marker = L.marker([latitud, longitud]).addTo(mymap);
    marker.bindPopup("Estás aquí").openPopup();
  }
});
mymap.on('click', function(e) {
  console.log(e);

});
