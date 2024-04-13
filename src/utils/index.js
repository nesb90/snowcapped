const _ = require('lodash');
const { POSTGRES } = require('../config');

/**
 *
 * @param {String} tableName The table name
 * @param {Number} id The data identifier
 * @returns
 */
function remove (tableName, id) {
  return `delete from ${POSTGRES.SCHEMA}.${tableName} where id='${id}'`;
};

/**
 *
 * @param {String} tableName The table name
 * @param {Number} id The data identifier
 * @param {Object} data Data to update
 * @returns String
 */
function update (tableName, id, data = {}) {
  let sql = `UPDATE ${POSTGRES.SCHEMA}.${tableName} SET `;
  Object.keys(data).forEach((key) => {
    if (data[key]) {
      sql += `${_.snakeCase(key)}='${data[key]}',`;
    };
  });
  sql += `updated_at='${new Date().toISOString()}' where id='${id}'`;

  return sql
};


/**
 *
 * @param {String} tableName The table name
 * @param {Number} id The data identifier
 * @param {Array} props Array with specific column names to select
 * @returns Array || String
 */
function select (tableName, id, props = []) {
  let query =  `select * from ${POSTGRES.SCHEMA}.${tableName}`;

  if (props.length > 0) {
    const keys = props.map((prop) => {
      return _.snakeCase(prop);
    });
    query = query.replace('*', `${keys.join(',')}`);
  };

  if (id) {
    return [`${query} where id=($1)`, [id]];
  } else {
    return `${query} order by id ASC`;
  };
};

/**
 *
 * @param {String} tableName The table name.
 * @param {Object} data The data to be inserted
 * @returns Array
 */
function insert (tableName, data) {
  const keys = [];
  const values = [];
  const holders = [];

  Object.entries(data).forEach(([key, val], index) => {
    if (val) {
      keys.push(_.snakeCase(key));
      values.push(val);
      holders.push(`$${index + 1}`);
    }
  });

  return [`insert into ${POSTGRES.SCHEMA}.${tableName} (${keys}) values (${holders})`, values];
};

function parseDataArray (arr = []) {
  return arr.map(item => {
    return parseData(item);
  });
};

function parseData (data = {}) {
  const parsedObject = {};
  Object.keys(data).forEach(prop => {
    parsedObject[_.camelCase(prop)] = data[prop];
  });

  return parsedObject;
};

function formatToISODate (date) {
  return date ? new Date(date).toISOString() : new Date().toISOString();
};

function isRequired(dependency) {
  throw new SyntaxError(`${dependency} is required.`);
};

module.exports = {
  isRequired,
  parseData,
  parseDataArray,
  formatToISODate,
  queryBuilder: {
    insert,
    select,
    update,
    remove
  }
};
