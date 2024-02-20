const mymap = L.map('sample_map').setView([40.741, -3.884], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
  maxZoom: 18
}).addTo(mymap);

var marker;

var Icono_posiscion = L.icon({
  iconUrl: './media/marcador-de-posicion.png',
  iconSize: [40, 45],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
  shadowSize: [68, 95],
});

const watchID = navigator.geolocation.watchPosition(function (position) { 
  var latitud = position.coords.latitude;
  var longitud = position.coords.longitude;
  
  mymap.setView([latitud, longitud], 20);
  

  if (marker){
    marker.setLatLng([latitud, longitud], );
  }
  else{
    marker = L.marker([latitud, longitud], {icon: Icono_posiscion}).addTo(mymap);
    marker.bindPopup("Estás aquí").openPopup();
  }
});


mymap.on('dblclick', function(e){
  var latitud_destino = e.latlng.lat;
  var longitud_destino = e.latlng.lng;

  var confirmación = window.confirm('¿Desea agregar este punto como destino?');

  if(confirmación){
    var marker_destino = L.marker([latitud_destino, longitud_destino]).addTo(mymap);
    var radio_destino = L.circle([latitud_destino, longitud_destino],  40).addTo(mymap);

    var visible = true;

    var intervalo = setInterval(function(){
      if(visible){
        radio_destino.setStyle({opacity: 0.7, fillOpacity: 0.3});
      }else{
        radio_destino.setStyle({opacity: 1, fillOpacity: 0.5});
      }
      visible = !visible;

    }, 500);
  }

})
mymap.on('click', function(e) {
  console.log(e);

});
