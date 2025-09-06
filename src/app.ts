import express from "express";
import path from "path";
import { allCapsStrategy, bulkParse, parse } from "shadowdark-parser";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/parse", (req, res) => {
	const { data, amount } = req.body;
	let result: ReturnType<typeof parse> | ReturnType<typeof bulkParse>;
	console.log(amount);
	switch(amount) {
		case 'single':
			result = parse(data);
			break;
		default:
			result = bulkParse(data, allCapsStrategy);
	}
	res.send(result);
});

app.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
