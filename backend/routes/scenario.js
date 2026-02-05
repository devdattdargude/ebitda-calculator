const r = require("express").Router();
const db = require("../db");
const crypto = require("crypto");

r.post("/save", async (req,res)=>{

  const s = req.body;

  // Get current version number
  const versionResult = await db.query(
    "select coalesce(max(version_no),0) from scenario_versions where scenario_id=$1",
    [s.id]
  );

  const versionNo = (versionResult.rows[0]?.coalesce || 0) + 1;

  await db.query(
    `insert into scenarios
     (id,name,property,owner_id,
      updated_at,scenario_type)
     values ($1,$2,$3,$4,$5,$6)`,
    [s.id,s.name,s.property,
     s.ownerId,s.updatedAt,s.scenarioType]
  );

  await db.query(
    `insert into scenario_versions
     (id,scenario_id,version_no,
      inputs,results,audit)
     values ($1,$2,$3,$4,$5,$6)`,
    [
      crypto.randomUUID(),
      s.id,
      versionNo,
      s.inputs,
      s.results,
      s.audit
    ]
  );

  res.send({ok:true});
});

r.get("/all", async (_,res)=>{

  const rows =
    await db.query(
      "select * from scenarios");

  res.send(rows.rows);
});

r.post("/approve", async (req,res)=>{

  const {id, userId, comment} = req.body;

  await db.query(
    `update scenarios
     set status='APPROVED',
          approved_by=$1,
          approved_at=now(),
          approval_comment=$2
     where id=$3`,
    [userId, comment, id]
  );

  res.send({ok:true});
});

r.post("/reject", async (req,res)=>{

  const {id, userId, comment} = req.body;

  await db.query(
    `update scenarios
     set status='REJECTED',
          approval_comment=$1
     where id=$2`,
    [comment, id]
  );

  res.send({ok:true});
});

r.post("/submit", async (req,res)=>{

  await db.query(
    `update scenarios
     set status='SUBMITTED'
     where id=$1`,
    [req.body.id]
  );

  res.send({ok:true});
});

r.get("/executive", async (_,res)=>{

  const rows = await db.query(
    `select property,
          sum(case when scenario_type='ACTUAL'
          then (results->>'ebitda')::numeric end) as actual,
 sum(case when scenario_type='BUDGET'
          then (results->>'ebitda')::numeric end) as budget
   from scenario_versions v
   join scenarios s
     on s.id=v.scenario_id
   group by property`
  );

  res.send(rows.rows);
});

r.get("/variance", async (req,res)=>{

  const { property } = req.query;

  const rows = await db.query(
    `select
      case when scenario_type='ACTUAL'
          then (results->>'ebitda')::numeric end) as actual,
      case when scenario_type='BUDGET'
          then (results->>'ebitda')::numeric end) as budget,
      s.scenario_type,
      s.name,
      s.property,
      s.owner_id,
      s.updated_at
   from scenarios s
   join scenario_versions v
     on s.id=v.scenario_id
     where s.property=$1
    order by s.updated_at desc`
  );

  res.send(rows.rows);
});

r.get("/forecast", async (req,res)=>{

  const { property } = req.query;

  const rows = await db.query(
    `select
      case when scenario_type='FORECAST'
          then (results->>'ebitda')::numeric end) as forecast
   from scenarios s
   join scenario_versions v
     on s.id=v.scenario_id
     where s.property=$1
    order by s.updated_at desc`
  );

  res.send(rows.rows);
});

module.exports = r;
