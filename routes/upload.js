const express = require('express');
const router = express.Router();
const multer = require('multer');
const iconv = require('iconv-lite');
const parse = require('csv-parse');
const db = require('../database');

const storage = multer.memoryStorage();

var upload = multer({
  storage,
  limits: {
    files: 1,                   // 複数ファイルのアップロードは不可。
    fileSize: 1024 * 1024 * 20, // 最大20MBまで許可。
  }
});

router.post('/', upload.single('file'), function (req, res) {
  if (!req.file) return;

  // バイナリデータから文字列に変換。
  const text = iconv.decode(req.file.buffer, 'UTF-8');

  const parseOptions = {
    auto_parse: true,
    delimiter: ',',
    columns: true,
    trim: true,
    skip_empty_lines: true
  }

  // CSV文字列をオブジェクトの配列に変換。
  parse(text, parseOptions, (err, records) => {
    if (err) {
      res.json({ status: 'error', message: err.message });
      return;
    }

    // DBに保存。
    db.insert(records).then((result) => {
      res.json({ status: 'ok', records, result });
    });
  });

});

module.exports = router;
