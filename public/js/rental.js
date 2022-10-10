function initMap() {
    var options = {
        zoom: 15,
        center: { lat: parseFloat(document.getElementById('lat').value), lng: parseFloat(document.getElementById('long').value) } //Coordinates of New York 
    }
    var address = document.getElementById('address').innerHTML;
    var loc = document.getElementById('map');
    var map = new google.maps.Map(loc, options);
    var marker = new google.maps.Marker({
        position: { lat: parseFloat(document.getElementById('lat').value), lng: parseFloat(document.getElementById('long').value) }, // Brooklyn Coordinates
        map: map, //Map that we need to add
        icon: 'https://img.icons8.com/fluent/48/000000/marker-storm.png',
        draggable: false,
        information: information
    });

    var information = new google.maps.InfoWindow({
        content: '<h4>' + address + '</h4>'
    });

    information.open(loc, marker);


}
