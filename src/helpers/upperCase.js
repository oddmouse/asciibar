const upperCase = () => {};

upperCase.register = (Handlebars) => {
	Handlebars.registerHelper("upperCase", (text) => {
		if (text == null || text === undefined) return "";
		return String(text).toUpperCase();
	});
};

module.exports = upperCase;
