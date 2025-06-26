const smartBreak = () => {};

smartBreak.register = (Handlebars) => {
	Handlebars.registerHelper("smartBreak", (text, maxLength) => {
		if (!text || typeof text !== "string") return "";

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

					processedLines.push(line.slice(start, end).trim());
					start = end + 1; // Skip the space
				}
			}
		});

		return processedLines.join("\n");
	});
};

module.exports = smartBreak;
