const currentDate = () => {};

currentDate.register = (Handlebars) => {
	Handlebars.registerHelper("currentDate", (yearOnly = false) => {
		const d = new Date();
		console.log();

		return !yearOnly ? d.toJSON() : d.getFullYear();
	});
};

module.exports = currentDate;
