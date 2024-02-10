mapboxgl.accessToken = mapToken;


const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: [77.209, 28.6139], // starting position [lng, lat]
    //center:coordinates,
    zoom: 9 // starting zoom
});

console.log(coordinates)

const marker1 = new mapboxgl.Marker()
    .setLngLat(coordinates)
    .addTo(map);