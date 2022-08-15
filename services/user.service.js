const mysqlConfig = require("../db/mysqlConfig");
const { MongoClient, url, dbName } = require("../db/mongoConfig");

class UserService {
  static async getUser(id, hashPassword) {
    const sql = `select m_id, m_name from member where m_id = '${id}' and m_pw = '${hashPassword}'`;
    let connection = null;
    try {
      connection = await mysqlConfig.getConnection(async (conn) => conn);
      const [result] = await connection.query(sql);
      return result[0];
    } catch (err) {
      throw err;
    } finally {
      if (connection) connection.release();
    }
  }

  static async getUserById(id) {
    const sql = `select * from member where m_id = '${id}'`;
    let connection = null;
    try {
      connection = await mysqlConfig.getConnection(async (conn) => conn);
      const [result] = await connection.query(sql);
      return result[0];
    } catch (err) {
      throw err;
    } finally {
      if (connection) connection.release();
    }
  }

  static async setUser(id, hashPassword, name, tel, addr) {
    const sql = `insert into member values ('${id}', '${hashPassword}', '${name}', '${tel}', '${addr}')`;
    let connection = null;
    try {
      connection = await mysqlConfig.getConnection(async (conn) => conn);
      await connection.query(sql);
    } catch (err) {
      throw err;
    } finally {
      if (connection) connection.release();
    }
  }

  static async setUser(id, hashPassword, name, tel, addr) {
    const sql = `insert into member values ('${id}', '${hashPassword}', '${name}', '${tel}', '${addr}')`;
    let connection = null;
    try {
      connection = await mysqlConfig.getConnection(async (conn) => conn);
      await connection.query(sql);
    } catch (err) {
      throw err;
    } finally {
      if (connection) connection.release();
    }
  }

  static async getOrderList(userId) {
    let client, db;
    try {
      client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
      db = client.db(dbName);
      let dbCollection = db.collection("order");
      return await dbCollection.find({ ord_id: userId }).sort({ ord_date: -1 }).toArray();
    } catch (err) {
      throw err;
    } finally {
      if (client) client.close();
    }
  }

  static async getLikeList(userId) {
    let client, db;
    try {
      client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
      db = client.db(dbName);
      let dbCollection = db.collection("like");
      return await dbCollection.find({ m_id: userId }).toArray();
    } catch (err) {
      throw err;
    } finally {
      if (client) client.close();
    }
  }

  static async getLikeProductInfo(search) {
    const sql = `select * from product where prd_id in(${search})`;
    let connection = null;
    try {
      connection = await mysqlConfig.getConnection(async (conn) => conn);
      const result = await connection.query(sql);
      return result[0];
    } catch (err) {
      throw err;
    } finally {
      if (connection) connection.release();
    }
  }
  static async setDeleteLikeList(deleteItem) {
    let client, db;
    try {
      client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
      db = client.db(dbName);
      let dbCollection = db.collection("like");
      await dbCollection.deleteMany(deleteItem);
    } catch (err) {
      throw err;
    } finally {
      if (client) client.close();
    }
  }

  static async setDeleteLikeOne(userId, deleteItem) {
    let client, db;
    try {
      client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
      db = client.db(dbName);
      let dbCollection = db.collection("like");
      await dbCollection.deleteOne({$and: [{ m_id: userId, prd_id: deleteItem }]});
    } catch (err) {
      throw err;
    } finally {
      if (client) client.close();
    }
  }

  static async getUserInfo(userId) {
    const sql = `select * from member where m_id = '${userId}'`;
    let connection = null;
    try {
      connection = await mysqlConfig.getConnection(async (conn) => conn);
      const [result] = await connection.query(sql);
      return result[0];
    } catch (err) {
      throw err;
    } finally {
      if (connection) connection.release();
    }
  }

  static async setUserInfo(userId, hashPassword, name, tel, addr) {
    const sql = `update member set m_pw = '${hashPassword}', m_name = '${name}', m_tel = '${tel}', m_addr = '${addr}' where m_id = '${userId}'`;
    let connection = null;
    try {
      connection = await mysqlConfig.getConnection(async (conn) => conn);
      await connection.query(sql);
    } catch (err) {
      throw err;
    } finally {
      if (connection) connection.release();
    }
  }
}

module.exports = UserService;