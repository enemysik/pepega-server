import { ConnectionPool } from 'mssql';

export default new ConnectionPool({
  database: 'TaskManagementCore',
  user: 'pepega',
  password: '1',
  server: 'localhost',
}, (ex => console.error(ex)));