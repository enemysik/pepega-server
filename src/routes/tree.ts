import { Router } from 'express';
import connection from '../connection';

interface Task {
  id: number;
  name: string;
  parentId: number;
  children: Task[];
}

const router = Router();
router.get('/tree', function (req, res) {
  const sql = `
  select 
	  TaskName as name,
	  ID as id,
	  ParentTaskID as parentId
  from 
    Tasks
`;
  connection.query(sql)
    .then(r => {
      const planarTree = r.recordset as Task[];
      // planarTree

      res.send(generateTree(planarTree));
      // res.send();
    })
    .catch(() => res.sendStatus(500));
})
export default router;

function generateTree(tree: Task[]) {
  const main = tree.filter(t => t.parentId == null);
  return main.map(m => oneTree(m, tree));
  // return main;
}
function oneTree(task: Task, tree: Task[]) {
  const children = tree.filter(t => t.parentId === task.id);
  task.children = children;
  task.children.forEach(c => oneTree(c, tree))
  return task;
}
// function oneTree1(tasks: Task[], tree: Task[]) {
//   // tasks.forEach()
//   const children = tree.filter(t => t.parentId === task.id);
//   task.children = children;
//   task.children.forEach(c => oneTree(c, tree))
//   return task;
// }