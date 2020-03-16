import { Router } from 'express';
import mssql, { Request } from 'mssql';
import connection from '../connection';

const router = Router();

router.delete('/:workId/time/:timeRangeId', async function (req, res) {
  try {
    const workId = req.params.workId;
    const timeRangeId = req.params.timeRangeId;
    console.log(workId, timeRangeId);
    await connection.query(`
    delete from WorkTimeRange
    where ID = ${timeRangeId}`);
    res.send(200);
  } catch (ex) {
    res.status(500);
    res.send(ex.message);
  }
});

router.post('/:workId/time', async function (req, res) {
  try {
    const workId = req.params.workId;
    const timeRange = req.body;
    const request = new Request(connection);
    request.input('workId', mssql.Int, workId);
    request.input('startTime', mssql.DateTime2, timeRange.startTime);
    request.input('endTime', mssql.DateTime2, timeRange.endTime);
    request.output('id', mssql.Int);

    const result = await request.batch(`
    insert into WorkTimeRange
    (WorkId, StartTime, EndTime)
    values
    (@workId, @startTime, @endTime);
    SET @id = SCOPE_IDENTITY()`);
    const id = result.output.id;
    res.send({ id });
  } catch (ex) {
    res.status(500);
    res.send(ex.message);
  }
})

router.put('/:workId/time/:timeId', async function (req, res) {
  try {
    const timeId = req.params.timeId;
    const timeRange = req.body;
    const request = new Request(connection);
    request.input('startTime', mssql.DateTime2, timeRange.startTime);
    request.input('endTime', mssql.DateTime2, timeRange.endTime);
    request.input('id', mssql.Int, timeId);

    await request.batch(`
    update WorkTimeRange
    set StartTime = @startTime, EndTime = @endTime
    where ID = @id`);
    res.send(200);
  } catch (ex) {
    res.status(500);
    res.send(ex.message);
  }
})

export default router;
