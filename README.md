# DynamoDb-SQRL-Store

[![License][license-badge]][license-url]

A [SQRL][sqrl] store for DynamoDb

## Installation

```bash
$ npm install dynamodb-sqrl-store
```

## Usage

```javascript
const DynamoDbSqrlStore = require('dynamodb-sqrl-store');
const store = new DynamoDbSqrlStore(tableName, awsConfig);
```

## Resources
Need a table to store the users, sqrl identities, and nuts.

```yaml
DynamoDbTable:
  Type: AWS::DynamoDB::Table
  DeletionPolicy: Retain
  Properties:
    TableName: sqrl
    AttributeDefinitions:
      - AttributeName: pk
        AttributeType: S
    KeySchema:
      - AttributeName: pk
        KeyType: HASH
    BillingMode: PAY_PER_REQUEST
```

## License

[MIT](https://github.com/jjasonclark/dynamodb-sqrl-store/LICENSE)

[license-badge]: https://img.shields.io/github/license/jjasonclark/dynamodb-sqrl-store.svg
[license-url]: https://opensource.org/licenses/MIT
[sqrl]: https://www.grc.com/sqrl/sqrl.htm
