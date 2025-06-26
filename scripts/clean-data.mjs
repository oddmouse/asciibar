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

async function cleanData() {
	output.cocktails = sortBy(output.cocktails, ["name"]);
	writeFileSync(outputPath, JSON.stringify(output));
}

void cleanData();
