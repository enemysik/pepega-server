import { Router } from 'express';
import connection from '../connection';
import tree from './tree';
import works from './works';
import { PreparedStatement, Date as MsDate } from 'mssql';

const router = Router();

router.use(tree);
router.use('/works', works);

router.get('/login/all', function (req, res) {
  res.send([{
    id: 1,
    name: 'Вова',
  },
  {
    id: 2,
    name: 'Jack',
  }])
});




router.post('/auth/login', function (req, res) {
  if (!req.body) return res.sendStatus(400);
  if (req.body.userId === 1) {
    return res.sendStatus(200);
  } else {
    return res.sendStatus(401);
  }
})

export default router;
