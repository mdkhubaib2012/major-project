
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: coordinates,
    zoom: 9
});

new mapboxgl.Marker({ color: 'red' })
    .setLngLat(coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML('<h6>Exact location provided after booking</h6>'))
    .addTo(map);
