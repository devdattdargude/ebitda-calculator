const r = require("express").Router();
const db = require("../db");

r.post("/login", async (req,res)=>{

  const {id,name} = req.body;

  await db.query(
    `insert into users(id,name)
     values ($1,$2)
     on conflict do nothing`,
    [id,name]);

  res.send({ok:true});
});

module.exports = r;
