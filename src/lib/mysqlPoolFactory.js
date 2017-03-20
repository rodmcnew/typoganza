import mysql from 'mysql'

/**
 * @TODO allow port number in connection string without errors
 *
 * @param connectionString
 * @returns {{user: string, password: string, host: string, database: string, port: number}}
 */
function parseMysqlConnectionString(connectionString) {
    connectionString = connectionString.substring(8, connectionString.length);
    let parts = connectionString.split(/mysql\:\/\/|\@|\:|\/|\?/);
    return {
        user: parts[0],
        password: parts[1],
        host: parts[2],
        database: parts[3],
        port: 3306
    };
}

/**
 * @param connectionString
 * @param connectionLimit
 * @returns {Pool}
 */
export default function (connectionString, connectionLimit) {
    let connectionDetails = parseMysqlConnectionString(connectionString);
    connectionDetails.connectionLimit = connectionLimit;
    return mysql.createPool(parseMysqlConnectionString(connectionString));
}
