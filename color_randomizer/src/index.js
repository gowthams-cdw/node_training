// imports
import fs from "fs";

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

// write the unique random colors to a new file
const destFilePath = "out/random_colors.json";

try {
	if (!fs.existsSync("out")) {
		fs.mkdirSync("out");
	}
	fs.writeFileSync(destFilePath, JSON.stringify(randomColors), "utf-8");
} catch (error) {
	console.error("Error writing to file:", error.message);
}

// read the output file
const outputFilePath = "out/random_colors.json";

const outputFile = fs.readFileSync(outputFilePath, "utf-8");
const jsonOutputFileFormat = JSON.parse(outputFile);
console.log(jsonOutputFileFormat);

////////////////////////
// print in color format
////////////////////////
// import chalk from "chalk";
//
// for (const color of jsonOutputFileFormat) {
// 	const colorName = color.color;
// 	const colorHex = color.code.hex;
//
// 	console.log(`${chalk.hex(colorHex)(colorName)}: ${colorHex}`);
// }
