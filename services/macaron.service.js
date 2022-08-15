const mysqlConfig = require("../db/mysqlConfig");
const { MongoClient, url, dbName } = require("../db/mongoConfig");

class MacaronService {

  static async getProduct4() {
    const sql = `select prd_img, prd_kor, prd_eng from product limit 4`;
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

  static async getContest4() {
    const sql = `select cont_title, cont_review, cont_img from contest order by cont_date desc limit 4`;
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

  static async getProducts() {
    const sql = `select prd_id, prd_img, prd_kor, prd_eng, prd_type from product`;
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

  static async getLikeList(userId, prdId) {
    let client, db;
    try {
      client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
      db = client.db(dbName);
      let dbCollection = db.collection("like");
      return await dbCollection.findOne({$and: [{ m_id: userId, prd_id: prdId }]});
    } catch (err) {
      throw err;
    } finally {
      if (client) client.close();
    }
  }

  static async setAddLikeItem(userId, prdId) {
    let client, db;
    try {
      client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
      db = client.db(dbName);
      let dbCollection = db.collection("like");
      await dbCollection.insert({ m_id: userId, prd_id: prdId }, { unique: true });
    } catch (err) {
      throw err;
    } finally {
      if (client) client.close();
    }
  }

  static async setMinusLikeItem(userId, prdId) {
    let client, db;
    try {
      client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
      db = client.db(dbName);
      let dbCollection = db.collection("like");
      return await dbCollection.deleteOne({$and: [{ m_id: userId, prd_id: prdId }]});
    } catch (err) {
      throw err;
    } finally {
      if (client) client.close();
    }
  }

  static async setAddOrder(userId, date, orderList) {
    let client, db;
    try {
      client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
      db = client.db(dbName);
      let dbCollection = db.collection("order");
      await dbCollection.insert({ ord_id: userId, ord_date: date, ord_content: orderList });
    } catch (err) {
      throw err;
    } finally {
      if (client) client.close();
    }
  }

  static async getContests() {
    const sql = `select cont_title, cont_review, cont_img, m_id from contest order by cont_date desc`;
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

  static async setAddContest(title, review, filename, userId) {
    const sql = `insert into contest(cont_title, cont_review, cont_img, m_id) value('${title}', '${review}', '${filename}', '${userId}')`;
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

module.exports = MacaronService;