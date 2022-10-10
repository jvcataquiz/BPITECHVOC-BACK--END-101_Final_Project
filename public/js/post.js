google.maps.event.addDomListener(window, 'load', initialize);
function initialize() {
    var input = document.getElementById('address');
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace();
        // place variable will have all the information you are looking for.

        document.getElementById("latitude").value = place.geometry['location'].lat();
        document.getElementById("longitude").value = place.geometry['location'].lng();
    });
}


var loadFile = function(event) {
    var image = document.getElementById('output');
    image.src=URL.createObjectURL(event.target.files[0]);
};