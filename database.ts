// const sqlite3 = require("sqlite3").verbose();
import { verbose as sqlite3, Database } from "sqlite3";

const db_path = "./db/data.db";

const mydb = {
  insert: (records: { id: number; name: string; memo: string }[]) => {
    // records配列のデータを全てDBに挿入する。
    return new Promise((resolve, reject) => {
      const db = new Database(db_path);
      const sql = `INSERT INTO items (id, name, memo) VALUES(?, ?, ?)`;

      for (const i of records) {
        db.run(sql, [i.id, i.name, i.memo], (err) => {
          if (err) {
            return console.log(err.message);
          }
          console.log(`INSERTED: ${i.id}, ${i.name}`);
        });
      }
      db.close();
      resolve(`${records.length}件保存しました。`);
    });
  },

  init: () => {
    // itemsテーブルが無ければ作成する。
    const db = new Database(db_path);
    db.get(
      'select count(*) from sqlite_master where type="table" and name=$name',
      { $name: "items" },
      (err, res) => {
        const exists = 0 < res["count(*)"];
        if (!exists) {
          db.run(
            "create table items (id int, name varchar(100), memo varchar(100))"
          );
        }
      }
    );
    db.close();
  },
};

export default mydb;
