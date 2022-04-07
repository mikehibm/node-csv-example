import express from "express";
const router = express.Router();

import multer from "multer";
import iconv from "iconv-lite";
import { parse, Options, CsvError } from "csv-parse";
import db from "../database";

const storage = multer.memoryStorage();

// Filter for CSV file
const csvFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (!file.mimetype.includes("csv")) {
    cb(new Error("Invalid file type."));
    return;
  }
  cb(null, true);
};
const upload = multer({
  storage: storage,
  fileFilter: csvFilter,
  limits: {
    files: 1, // 複数ファイルのアップロードは不可。
    fileSize: 1024 * 1024 * 20, // 最大20MBまで許可。
  },
});


router.post("/", upload.single("file"), function (req, res) {
  if (!req.file) return;

  // バイナリデータから文字列に変換。
  const text = iconv.decode(req.file.buffer, "UTF-8");

  const parseOptions: Options = {
    auto_parse: true,
    delimiter: ",",
    columns: true,
    trim: true,
    skip_empty_lines: true,
  };

  // CSV文字列をオブジェクトの配列に変換。
  parse(text, parseOptions, (err: CsvError | undefined, records: any) => {
    if (err) {
      res.json({ status: "error", message: err.message });
      return;
    }

    // DBに保存。
    db.insert(records).then((result) => {
      res.json({ status: "ok", records, result });
    });
  });
});

module.exports = router;
