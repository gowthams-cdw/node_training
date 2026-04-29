// imports

import * as dotenv from "dotenv";
import fs from "fs";
import http from "http";

// setup environment variables
dotenv.config();

// reading file
const srcFilePath = "src/data/color_palette.json";

const inputFile = fs.readFileSync(srcFilePath, "utf-8");
const jsonInputFileFormat = JSON.parse(inputFile);

// create a function to generate random colors each time
const generateRandomColors = (randomColorCount) => {
	// if randomColorCount is higher than avail colors, risk of infinite loop
	if (randomColorCount > jsonInputFileFormat.length) {
		throw new Error(
			"Random color count exceeds available colors in the palette.",
		);
	}

	const randomColors = [];
	for (let i = 0; i < randomColorCount; i++) {
		const randomIndex = Math.floor(Math.random() * jsonInputFileFormat.length);

		randomColors.push(jsonInputFileFormat[randomIndex]);
		jsonInputFileFormat.splice(randomIndex, 1);
	}

	return randomColors;
};

// create server
const server = http.createServer((req, res) => {
	if (req.url === "/") {
		res.statusCode = 200;
		res.setHeader("Content-Type", "application/json");
		res.end(JSON.stringify(generateRandomColors(5)));
	} else {
		res.statusCode = 404;
		res.setHeader("Content-Type", "application/json");
		res.end(JSON.stringify({ error: "Not Found" }));
	}
});

// listen server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}/`);
});
