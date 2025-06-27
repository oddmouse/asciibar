const smartBreak = () => {};

smartBreak.register = (Handlebars) => {
	Handlebars.registerHelper("smartBreak", (text, maxLength, paddingString) => {
		if (!text || typeof text !== "string") return "";

		// Handle optional parameters - check if paddingString is actually a string
		let padding = "";
		if (typeof paddingString === "string") {
			padding = paddingString;
		}

		// Split by existing line breaks first
		const existingLines = text.split(/\r?\n/);
		const processedLines = [];

		existingLines.forEach((line) => {
			if (line.length <= maxLength) {
				// Line is already within limit, keep as-is
				processedLines.push(line);
			} else {
				// Process this line for breaking
				let start = 0;
				let isFirstSegment = true;

				while (start < line.length) {
					let end = Math.min(start + maxLength, line.length);

					// If we're not at the end and the next character isn't a space
					if (end < line.length && line[end] !== " ") {
						// Look backwards for a space
						const lastSpace = line.lastIndexOf(" ", end);
						if (lastSpace > start) {
							end = lastSpace;
						}
					}

					let segment = line.slice(start, end).trim();

					// Add padding to continuation lines (not the first segment)
					if (!isFirstSegment && segment && padding) {
						segment = padding + segment;
					}

					processedLines.push(segment);
					start = end + 1; // Skip the space
					isFirstSegment = false;
				}
			}
		});

		return processedLines.join("\n");
	});
};

module.exports = smartBreak;
