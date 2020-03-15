'use strict';

const AWS = require('aws-sdk');
const nanoid = require('nanoid');

class DynamoDbSqrlStore {
  constructor(tableName, awsConfig) {
    this.tableName = tableName;
    this.dynamoDb = new AWS.DynamoDB.DocumentClient(awsConfig);
  }

  async createNut(it) {
    const newNut = {
      id: nanoid(),
      initial: it.initial,
      hmac: it.hmac,
      ip: it.ip,
      user_id: it.user_id,
      ask: it.ask,
      idk: it.idk,
      created: new Date().toISOString(),
      issued: null,
      identified: null
    };
    const result = await this.dynamoDb
      .put({
        TableName: this.tableName,
        Item: Object.assign({}, newNut, { pk: `nut_${newNut.id}` })
      })
      .promise();
    return newNut;
  }

  async retrieveNut(id) {
    const result = await this.dynamoDb
      .get({
        TableName: this.tableName,
        Key: { pk: `nut_${id}` }
      })
      .promise();

    if (!result || !result.Item) {
      return null;
    }
    return result.Item;
  }

  async updateNut(it) {
    const result = await this.dynamoDb
      .put({
        TableName: this.tableName,
        Item: Object.assign({}, it, { pk: `nut_${it.id}` })
      })
      .promise();
    return it;
  }

  async createSqrl(sqrl) {
    const sqrlDbId = `sqrl_${sqrl.idk}`;
    const userDbId = `user_${sqrl.user_id}_sqrl`;
    const result = await this.dynamoDb
      .batchWrite({
        RequestItems: {
          [this.tableName]: [
            {
              PutRequest: { Item: Object.assign({}, sqrl, { pk: sqrlDbId }) }
            },
            {
              PutRequest: { Item: Object.assign({}, sqrl, { pk: userDbId }) }
            }
          ]
        }
      })
      .promise();
    return sqrl;
  }

  async retrieveSqrl(idks) {
    const results = [];
    for (const idk of idks) {
      const result = await this.dynamoDb
        .get({
          TableName: this.tableName,
          Key: { pk: `sqrl_${idk}` }
        })
        .promise();

      if (result && result.Item) {
        results.push(result.Item);
      } else {
        results.push(null);
      }
    }
    return results;
  }

  async retrieveSqrlByUser(id) {
    const result = await this.dynamoDb
      .get({
        TableName: this.tableName,
        Key: { pk: `user_${id}_sqrl` }
      })
      .promise();

    if (result && result.Item) {
      return result.Item;
    }
    return null;
  }

  async updateSqrl(it) {
    return await this.createSqrl(it);
  }

  // Create an account
  async createUser() {
    const user = {
      id: nanoid(),
      created: new Date().toISOString()
    };
    const result = await this.dynamoDb
      .put({
        TableName: this.tableName,
        Item: Object.assign({}, user, { pk: `user_${user.id}` })
      })
      .promise();
    return user;
  }

  async retrieveUser(id) {
    const result = await this.dynamoDb
      .get({
        TableName: this.tableName,
        Key: { pk: `user_${id}` }
      })
      .promise();

    if (!result || !result.Item) {
      return null;
    }
    return { id: result.Item.id, created: result.Item.created };
  }
}

module.exports = DynamoDbSqrlStore;
