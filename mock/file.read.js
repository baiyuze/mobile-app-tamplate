const fs = require('fs');
const path = require("path");
function fromJSONFile(filename) {
	return (req, res) => {
		const data = fs.readFileSync(path.resolve(`./mock/test/${filename}.json`)).toString();
		const json = JSON.parse(data);
		return res.json(json);
	};
}

module.exports = fromJSONFile;