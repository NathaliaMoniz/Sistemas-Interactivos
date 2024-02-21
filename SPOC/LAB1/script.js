const mymap = L.map('sample_map').setView([40.741, -3.884], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
  maxZoom: 18
}).addTo(mymap);


var marker;
var marker_destino;
var destinos = [];

var Icono_posiscion = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      shadowSize: [41, 41],
      shadowAnchor: [12, 41],
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'
});

// Se calcula la posición inicial para centrar al usuario por primera vez
navigator.geolocation.getCurrentPosition(function (position){
  var latitud = position.coords.latitude;
  var longitud = position.coords.longitude;
  
  mymap.setView([latitud, longitud], 20);
});

function añadirDestino(e){

  // Se crea el macador y su área
  var marker_destino = L.marker(e.latlng).addTo(mymap);
  var circle = L.circle(e.latlng, { radius: 60, opacity: 0.5 }).addTo(mymap);

  // Se añaden a la lista de destinos
  destinos.push({ marker: marker_destino, circle: circle });

  // Animación del círculo
  setInterval(function () {
    circle.setStyle({ opacity: circle.options.opacity === 0.5 ? 0 : 0.5 });
  }, 500);

  // Asignamos el evento para eliminar los marcadores al hacer click en ellos
  marker_destino.on('click', function () {
        var confirmDelete = confirm("¿Desea eliminar este destino?");
        if (confirmDelete) {
            mymap.removeLayer(marker_destino);
            mymap.removeLayer(circle);
            destinos = destinos.filter(function (item) {
                return item.marker !== marker_destino;
            });   
        }
  });
}

// Asignamos para añadir marcadores al hacer doble click en ellos
mymap.on('dblclick', function (e) {
  var addDestination = confirm("¿Desea añadir un destino?");
  if (addDestination) {
      añadirDestino(e);
  }
});

// Se obtiene la posición actualizada del usuario
const watchID = navigator.geolocation.watchPosition(function (position) { 
  var latitud = position.coords.latitude;
  var longitud = position.coords.longitude;

  // Si ya existe el marcador de origen se actualiza su posición
  if (marker){
    marker.setLatLng([latitud, longitud]);
  }

  // Si no existe se crea uno 
  else{
    marker = L.marker([latitud, longitud], {icon: Icono_posiscion}).addTo(mymap);
    marker.bindPopup("Estás aquí").openPopup();
  }

  destinos.forEach(function (item){
    // Si me encuentro dentro del area de mi destino el dispositivo empieza a vibrar
      var centro = item.circle.getLatLng();
      var distancia = centro.distanceTo([latitud, longitud])
      var duracionVibracion = Math.max(0, item.circle.getRadius() - distancia);
    
      if (distancia <= item.circle.getRadius()) {
        
        // La vibración será más fuerte mientras más cerca esté del destino
        navigator.vibrate([duracionVibracion * 10, 50]);
      }
  })
  
});

// Al presionar el botón de centrar el mapa se centra en el marcador del usuario
document.getElementById('centrar').addEventListener('click', function() {
  navigator.geolocation.getCurrentPosition(function(position) {
      var latitud = position.coords.latitude;
      var longitud = position.coords.longitude;
      
      // Centra el mapa en la posición del usuario
      mymap.setView([latitud, longitud], 20);
  });
});

mymap.on('click', function(e) {
  console.log(e);

});
