import express from "express";
import path from "path";
import {
  allCapsStrategy,
  bulkParse,
  getTemplateFromFile,
  parse,
} from "shadowdark-parser";
import multer from "multer";
import bodyParser from "body-parser";
import { readFileSync, unlink } from "fs";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

const upload = multer({ dest: path.join(__dirname, "uploaded-templates/") });

app.post("/api/parse", upload.single("template"), (req, res) => {
  const { data, amount } = req.body;
  let result: ReturnType<typeof parse> | ReturnType<typeof bulkParse>;
  try {
    switch (amount) {
      case "single":
        result = parse(data);
        break;
      default:
        result = bulkParse(data, allCapsStrategy);
    }

    if (req.file) {
      const template = getTemplateFromFile(req.file.path);
      res.type("text/plain").send(template(result));
      unlink(req.file.path, (err) => {
        if (err) {
          console.error(err);
        }
        console.log("Removed file");
      });
    } else {
      res.send(result);
    }
  } catch (e: unknown) {
    console.error("Error!");
    if (e instanceof Error) {
      console.error(e.message);
    } else {
      console.error(e);
    }
    res.status(500).send("Parsing error");
  }
});

app.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
