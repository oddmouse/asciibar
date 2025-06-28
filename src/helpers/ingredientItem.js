const ingredientItem = () => {};

ingredientItem.register = (Handlebars) => {
	Handlebars.registerHelper("ingredientItem", (obj) => {
		if (obj == null || obj === undefined) return "";
		const { amount, name, note } = obj;
		return `▸ ${amount[0].quantity} ${amount[0].unit}${amount[1] ? ` (${amount[1].quantity} ${amount[1].unit})` : ""} ${name}${note ? ` (${note})` : ""}`;
	});
};

module.exports = ingredientItem;
