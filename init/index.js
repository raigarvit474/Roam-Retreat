require("dotenv").config();
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');


const mapToken = process.env.MAP_TOKEN;


if (!mapToken) {
    console.error('Mapbox access token (MAP_TOKEN) is missing or invalid.');
    process.exit(1);
}

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

main().then(() => {
    console.log("Connected to DB");
    initDB();
}).catch((err) => {
    console.error("Failed to connect to DB:", err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});

    const listingsToInsert = [];

    for (let i = 0; i < initData.data.length; i++) {
        const listingData = initData.data[i];

        // Use geocoding client to fetch latitude and longitude
        try {
            const response = await geocodingClient.forwardGeocode({
                query: listingData.location,
                limit: 1
            }).send();

            if (response.body && response.body.features && response.body.features.length > 0) {
                listingData.geometry = {
                    type: 'Point',
                    coordinates: response.body.features[0].geometry.coordinates
                };

                listingsToInsert.push({
                    ...listingData,
                    owner: '666d60d06f754fae45d8339e'
                });
            } else {
                console.error(`Geocoding failed for location: ${listingData.location}`);
            }
        } catch (error) {
            console.error(`Error geocoding location ${listingData.location}:`, error);
        }
    }

    if (listingsToInsert.length > 0) {
        await Listing.insertMany(listingsToInsert);
        console.log("Data was Initialized");
    } else {
        console.log("No valid listings to insert");
    }
};