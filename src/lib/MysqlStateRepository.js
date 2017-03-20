export default class MysqlStateRepository {
    constructor(mysqlConnectionPool) {
        this.mysqlPool = mysqlConnectionPool;
    }

    put(state) {
        this.mysqlPool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query('UPDATE state SET state = ? WHERE id=0',
                [JSON.stringify(state)],
                function (error) {
                    connection.release();
                    if (error) throw error;
                    console.log('State repository - PUT successful');
                });
        });
    }

    get(callback) {
        this.mysqlPool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query('SELECT state from state where id=0 limit 1',
                function (error, results) {
                    connection.release();
                    if (error) throw error;
                    console.log('State repository - GET successful');
                    callback(JSON.parse(results[0].state));
                });
        });
    }
}
