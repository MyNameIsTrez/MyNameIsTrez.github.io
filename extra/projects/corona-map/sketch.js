/*
DESCRIPTION
P5.js + Mappa.js + 2020-06-16/17 COVID-19 world data!

SOURCES
- lat_lon_data.csv website: https://gist.github.com/tadast/8827699
- lat_lon_data.csv download: https://gist.githubusercontent.com/tadast/8827699/raw/3cd639fa34eec5067080a61c69e3ae25e3076abb/countries_codes_and_coordinates.csv
- covid_data.csv website: https://ourworldindata.org/coronavirus-source-data
- covid_data.csv download: https://covid.ourworldindata.org/data/owid-covid-data.csv
*/

let covidData;
let countries;

const mappa = new Mappa("Leaflet");
let trainMap;
let canvas;

let data;

const options = {
	lat: 0,
	lng: 0,
	zoom: 1.5,
	style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
};

const unusableTopics = [
	"iso_code", "continent", "location", "date", "tests_units"
];

let topicSelect, circleSizeSlider;


function preload() {
	covidData = loadTable("covid_data.csv", "header");
	countries = loadTable("lat_lon_data.csv", "header");

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(pos => {
			const coords = pos.coords;
			options.lat = coords.latitude;
			options.lng = coords.longitude;
			options.zoom = 3.5;
		});
	} else {
		console.log("Geolocation is not supported by this browser.");
		geoError();
	}
}

function setup() {
	canvas = createCanvas(innerWidth - 1, innerHeight - 24);
	noStroke();

	trainMap = mappa.tileMap(options);
	trainMap.overlay(canvas);

	topics = covidData.columns.filter(function (topic) {
		return !unusableTopics.includes(topic);
	});

	topicSelect = createSelect().changed(setData);

	// Logarithmic.
	circleSizeSlider = createSlider(-0.5, 0.5, 0, 0).input(setData);

	for (const topic of topics) {
		topicSelect.option(topic);
	}

	setData();
}

function draw() {
	clear();
	for (const country of data) {
		const pix = trainMap.latLngToPixel(country.lat, country.lon);

		const sinArg = frameCount / 180 * TWO_PI / 4;
		const red = 255 * (sin(sinArg) + 1) / 2;
		const green = 255 * (sin(sinArg + TWO_PI / 3) + 1) / 2;
		const blue = 255 * (sin(sinArg + TWO_PI / 3 * 2) + 1) / 2;
		fill(red, green, blue, 100);

		const zoom = trainMap.zoom();
		const scl = pow(2, zoom);
		ellipse(pix.x, pix.y, country.diameter * scl);
	}
}


function setData() {
	data = [];
	const topic = topicSelect.value();

	// Because the data is distributed across multiple lines in the file,
	// we use this to track whether the current line is about the same country as the previous line.
	let previousCountryName;

	for (const rowCovidData of covidData.rows) {
		const countryName = rowCovidData.get("location");

		if (previousCountryName === countryName) {
			data[data.length - 1].count += Number(rowCovidData.get(topic));
			continue;
		} else {
			previousCountryName = countryName;
		}

		const isoCode = rowCovidData.get("iso_code");

		let latlon;
		for (const row2 of countries.rows) {
			if (isoCode === row2.get("Alpha-3 code").slice(2, -1)) {
				latlon = {
					lat: Number(row2.get("Latitude (average)").slice(2, -1)),
					lon: Number(row2.get("Longitude (average)").slice(2, -1))
				};
				break;
			}
		}

		if (latlon) {
			const lat = latlon.lat;
			const lon = latlon.lon;
			const count = Number(rowCovidData.get(topic));
			data.push({
				lat,
				lon,
				count
			});
		}
	}

	let minCount = Infinity;
	let maxCount = 0;
	for (const country of data) {
		minCount = min(minCount, country.count);
		maxCount = max(maxCount, country.count);
	}

	const minD = sqrt(max(minCount, 0)); // sqrt() can't accept negative numbers.
	const maxD = sqrt(maxCount);
	for (const country of data) {
		country.diameter = map(sqrt(country.count) * 10 ** circleSizeSlider.value(), minD, maxD, 1, 20);
	}
}