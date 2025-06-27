#!/usr/bin/env node

/**
 * Cleans up the data and converts units from the IBA cocktail list proved by
 * https://github.com/rasmusab/iba-cocktails
 */

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sortBy } from "lodash-es";

const filePath = path.dirname(fileURLToPath(import.meta.url));

const inputFilePath = "./iba-cocktails-web.json";
const inputPath = path.resolve(filePath, inputFilePath);
const inputBuffer = readFileSync(inputPath);
const input = JSON.parse(inputBuffer.toString("utf8"));

const outputFilePath = "./cocktails.json";
const outputPath = path.resolve(filePath, outputFilePath);

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

// Function to transform ingredient to new structure
function transformIngredient(ingredient) {
	const newIngredient = {
		name: ingredient.ingredient,
	};

	// Add note if it exists
	if (ingredient.note) {
		newIngredient.note = ingredient.note;
	}

	// Create amount array
	const amounts = [];

	// Add original amount
	amounts.push({
		quantity: ingredient.quantity,
		unit: ingredient.unit,
	});

	// If it's ml, add oz conversion
	if (
		ingredient.unit === "ml" &&
		!Number.isNaN(parseFloat(ingredient.quantity))
	) {
		const ml = parseFloat(ingredient.quantity);
		const ozFraction = mlToOzFraction(ml);
		amounts.push({
			quantity: ozFraction,
			unit: "oz",
		});
	}

	newIngredient.amount = amounts;

	return newIngredient;
}

async function cleanData() {
	// Sort cocktails by name and transform structure
	const output = sortBy(input, ["name"]).map((cocktail) => ({
		name: cocktail.name,
		method: cocktail.method,
		...(cocktail.garnish && { garnish: cocktail.garnish }),
		ingredients: cocktail.ingredients.map(transformIngredient),
	}));

	writeFileSync(outputPath, JSON.stringify(output, null, 2));
}

void cleanData();
