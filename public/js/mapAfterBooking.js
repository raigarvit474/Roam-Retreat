mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    // choose from mapbox,s core styles or make your own style with Mapbox studio
    style:"mapbox://styles/mapbox/streets-v12",
    center:listing.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});


const marker = new mapboxgl.Marker({color:"red"})
        .setLngLat(listing.geometry.coordinates)//Listing.geometry.coordinates
        .setPopup(
            new mapboxgl.Popup({
                offset:25,
            })
        )
        
        .addTo(map);