// imports
import fs from "fs";
import http from "http";
import * as dotenv from "dotenv";

// setup environment variables
dotenv.config();

// reading file
const srcFilePath = "src/data/color_palette.json";

const inputFile = fs.readFileSync(srcFilePath, "utf-8");
const jsonInputFileFormat = JSON.parse(inputFile);

// picking random colors
const randomColorCount = 5;
const randomColors = [];
const colorSet = new Set();
for (let i = 0; i < randomColorCount; i++) {
	// to get unique random color
	while (true) {
		const randomIndex = Math.floor(Math.random() * jsonInputFileFormat.length);
		if (colorSet.has(randomIndex)) {
			continue;
		}

		// add to new hashset
		randomColors.push(jsonInputFileFormat[randomIndex]);
		colorSet.add(randomIndex);
		break;
	}
}

// create server
const server = http.createServer((req, res) => {
	if (req.url === "/") {
		res.statusCode = 200;
		res.setHeader("Content-Type", "application/json");
		res.end(JSON.stringify(randomColors));
	} else {
		res.statusCode = 404;
		res.setHeader("Content-Type", "application/json");
		res.end(JSON.stringify({ error: "Not Found" }));
	}
})

// listen server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}/`);
})
