// covid-data.csv: https://ourworldindata.org/coronavirus-source-data

// Customizable.
const topic1 = "total_cases";


// Not customizable.
let covidData;
let countries;

const mappa = new Mappa("Leaflet");
let trainMap;
let canvas;

const data = [];

const options = {
	lat: 0,
	lng: 0,
	zoom: 1.5,
	style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
};

const unusableTopics = [
	"iso_code", "continent", "location", "date"
];

function preload() {
	covidData = loadTable("covid_data.csv", "header");
	countries = loadTable("lat_lon_data.csv", "header");
}

function setup() {
	canvas = createCanvas(800, 600);

	trainMap = mappa.tileMap(options);
	trainMap.overlay(canvas);

	console.log(covidData);
	// console.log(countries);

	topics = covidData.columns.filter(function (topic) {
		return !unusableTopics.includes(topic);
	});

	let previousCountryName;
	for (const rowCovidData of covidData.rows) {
		const countryName = rowCovidData.get("location");

		if (previousCountryName === countryName) {
			data[data.length - 1].count += Number(rowCovidData.get(topic1));
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
			const count = Number(rowCovidData.get(topic1));
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
		country.diameter = map(sqrt(country.count), minD, maxD, 1, 20);
	}
}

function draw() {
	clear();
	for (const country of data) {
		const pix = trainMap.latLngToPixel(country.lat, country.lon);
		const red = 255 * (sin(frameCount / 60 * TWO_PI / 4) + 1) / 2;
		fill(red, 0, 200, 100);
		const zoom = trainMap.zoom();
		const scl = pow(2, zoom);
		ellipse(pix.x, pix.y, country.diameter * scl);
	}
}
