let youtubeData;
let countries;

const mappa = new Mappa('Leaflet');
let trainMap;
let canvas;

const data = [];

const options = {
	lat: 0,
	lng: 0,
	zoom: 1.5,
	style: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
};

function preload() {
	youtubeData = loadTable('subscribers_geo.csv', 'header');
	countries = loadJSON('countries.json');
}

function setup() {
	canvas = createCanvas(800, 600);
	trainMap = mappa.tileMap(options);
	trainMap.overlay(canvas);

	let maxSubs = 0;
	let minSubs = Infinity;

	for (const row of youtubeData.rows) {
		const country = row.get('country_id').toLowerCase();
		const latlon = countries[country];
		if (latlon) {
			const lat = latlon[0];
			const lon = latlon[1];
			const count = Number(row.get('subscribers'));
			data.push({
				lat,
				lon,
				count
			});
			maxSubs = max(maxSubs, count);
			minSubs = min(maxSubs, count);
		}
	}

	const minD = sqrt(minSubs);
	const maxD = sqrt(maxSubs);

	for (const country of data) {
		country.diameter = map(sqrt(country.count), minD, maxD, 1, 20);
	}
}

function draw() {
	clear();
	for (const country of data) {
		const pix = trainMap.latLngToPixel(country.lat, country.lon);
		fill((sin(frameCount / 60 * TWO_PI / 4) + 1) / 2 * 255, 0, 200, 100);
		const zoom = trainMap.zoom();
		const scl = pow(2, zoom);
		ellipse(pix.x, pix.y, country.diameter * scl);
	}
}
