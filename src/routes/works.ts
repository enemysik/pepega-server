import { Router } from 'express';
import connection from '../connection';
import times from './times';
import mssql, { Request } from 'mssql';

const router = Router();
router.use(times)

router.get('/:date', async function (req, res) {
  try {
    const date = new Date(req.params.date);
    date.setHours(0);
    date.setMinutes(-date.getTimezoneOffset());
    date.setSeconds(0);
    date.setMilliseconds(0);
    const sql = `
    select 
      id,
      WorkName as name,
      taskId,
      startDate,
      description
    from works
    where 
      StartDate = cast('${date.toISOString()}'as datetime2)
    and 
      UserId = 19`;
    const works = (await connection.query(sql)).recordset;
    for (const work of works) {
      const timeSql = `
      select 
        id,
        startTime, 
        endTime
      from WorkTimeRange
      where WorkId = ${work.id}`;
      const times = (await connection.query(timeSql)).recordset;
      work.times = times;
    }
    res.send(works);
  } catch (ex) {
    res.status(500);
    res.send(ex.message);
  }
});

router.put('/:workId', async function (req, res) {
  try {
    if (!req.body) res.sendStatus(400);
    const workId = req.params.workId;
    const work = req.body;
    console.log(work.name);
    console.log(req.body);
    const sql = `
    update Works
    set
      WorkName = '${work.name}',
      Description = '${work.description}'
    where ID = ${workId}`;

    await connection.query(sql);

    res.sendStatus(200);
  } catch (ex) {
    res.status(500);
    res.send(ex.message);
  }
});

router.post('/', async function (req, res) {
  try {
    const work = req.body;
    const request = new Request(connection);
    request.input('workName', mssql.NVarChar, work.name);
    request.input('description', mssql.NVarChar, work.description);
    request.input('taskId', mssql.Int, work.taskId);
    request.input('startDate', mssql.DateTime2, work.startDate);
    request.output('outputId', mssql.Int, 0); // TODO change UserId
    const sql = `
    insert into works 
    (WorkName, Description, TaskID, WorkTypeID, StartDate, userId)
    values
    (@workName, @description, @taskId, 0, @startDate, 19);
    SET @outputId = SCOPE_IDENTITY();`;
    const result = await request.batch(sql);
    const id = result.output.outputId;
    res.send({ id });
  } catch (ex) {
    res.status(500);
    res.send(ex.message);
  }
})

router.delete('/:workId', async function (req, res) {
  try {
    const workId = req.params.workId;
    await connection.query(`
    delete from works
      where ID = ${workId}
    `);
    res.sendStatus(200);
  } catch (ex) {
    res.status(500);
    res.send(ex.message);
  }
})

export default router;
