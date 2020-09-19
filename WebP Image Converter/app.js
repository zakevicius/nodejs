const imagemin = require('imagemin');
const webp = require('imagemin-webp');
const outputFolder = './img/webp';
const PNG = './img/*.png';
const JPEG = './img/*.{jpeg,jpg}';

(async () => {
	await imagemin([PNG], {
		destination: outputFolder,
		plugins: [
			webp({
				nearLossless: 1
			})
		]
	});
})();

(async () => {
	await imagemin([JPEG], {
		destination: outputFolder,
		plugins: [
			webp({
				quality: 1 //  Quality setting from 0 to 100
			})
		]
	});
})();

console.log('Images optimized');
