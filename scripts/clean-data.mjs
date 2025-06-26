#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sortBy } from "lodash-es";

const filePath = path.dirname(fileURLToPath(import.meta.url));

const inputFilePath = "../src/original.json";
const inputPath = path.resolve(filePath, inputFilePath);
const inputBuffer = readFileSync(inputPath);
const input = JSON.parse(inputBuffer.toString("utf8"));

const outputFilePath = "../src/data.json";
const outputPath = path.resolve(filePath, outputFilePath);
const output = input;

// Function to convert ml to fractional ounces
function mlToOzFraction(ml) {
	const oz = ml / 29.5735; // 1 oz = 29.5735 ml

	// Common fractions used in cocktails
	const fractions = [
		{ decimal: 0.125, fraction: "1/8" },
		{ decimal: 0.25, fraction: "1/4" },
		{ decimal: 0.5, fraction: "1/2" },
		{ decimal: 0.75, fraction: "3/4" },
		{ decimal: 1, fraction: "1" },
		{ decimal: 1.25, fraction: "1 1/4" },
		{ decimal: 1.5, fraction: "1 1/2" },
		{ decimal: 1.75, fraction: "1 3/4" },
		{ decimal: 2, fraction: "2" },
		{ decimal: 2.5, fraction: "2 1/2" },
		{ decimal: 3, fraction: "3" },
	];

	// Find the closest fraction
	let closest = fractions[0];
	let minDiff = Math.abs(oz - closest.decimal);

	for (const frac of fractions) {
		const diff = Math.abs(oz - frac.decimal);
		if (diff < minDiff) {
			minDiff = diff;
			closest = frac;
		}
	}

	return closest.fraction;
}

// Function to convert ingredient quantities and units
function convertIngredient(ingredient) {
	if (
		ingredient.unit === "ml" &&
		!Number.isNaN(parseFloat(ingredient.quantity))
	) {
		const ml = parseFloat(ingredient.quantity);
		const ozFraction = mlToOzFraction(ml);

		return {
			...ingredient,
			quantity: ozFraction,
			unit: "oz",
			direction: ingredient.direction.replace(`${ml} ml`, `${ozFraction} oz`),
		};
	}

	return ingredient;
}

async function cleanData() {
	// Sort cocktails by name
	output.cocktails = sortBy(output.cocktails, ["name"]);

	// Convert ml to oz fractions for all ingredients
	output.cocktails = output.cocktails.map((cocktail) => ({
		...cocktail,
		ingredients: cocktail.ingredients.map(convertIngredient),
	}));

	writeFileSync(outputPath, JSON.stringify(output, null, 2));
}

void cleanData();
