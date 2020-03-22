import { Router } from 'express';
import connection from '../connection';
import { IResult, IRecordSet } from 'mssql';

interface Task {
  id: number;
  name: string;
  parentId: number;
  children: Task[];
}

const router = Router();

router.get('/tree', async function (req, res) {
  try {
    const planarTree = (await connection.query(`
    select TaskName as name, id, ParentTaskID as parentId
    from Tasks`)).recordset as IRecordSet<Task>;
    const globalTree = generateTree(planarTree);
    res.send({globalTree, planarTree});
  } catch (ex) {
    res.status(500);
    res.send(ex.message);

  }
})

function generateTree(tree: Task[]) {
  const main = tree.filter(t => t.parentId == null);
  return main.map(m => oneTree(m, tree));
}
function oneTree(task: Task, tree: Task[]) {
  const children = tree.filter(t => t.parentId === task.id);
  task.children = children;
  task.children.forEach(c => oneTree(c, tree))
  return task;
}
export default router;
