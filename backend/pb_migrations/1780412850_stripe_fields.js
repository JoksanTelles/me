/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);

  // 1. Update purchases collection
  const purchasesCollection = dao.findCollectionByNameOrId("1kfrtrzsnyv1phg"); // Using ID from previous migration

  purchasesCollection.schema.addField(new SchemaField({
    "system": false,
    "id": "stripe_sess",
    "name": "stripe_session_id",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": true,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }));

  purchasesCollection.schema.addField(new SchemaField({
    "system": false,
    "id": "stripe_pi",
    "name": "stripe_payment_intent_id",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }));

  dao.saveCollection(purchasesCollection);

  // 2. Create payment_logs collection
  const logsCollection = new Collection({
    "id": "paylog123456789",
    "name": "payment_logs",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "event_type",
        "name": "event_type",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "payload",
        "name": "payload",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 2000000
        }
      },
      {
        "system": false,
        "id": "status",
        "name": "status",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return dao.saveCollection(logsCollection);
}, (db) => {
  const dao = new Dao(db);
  
  // Revert purchases changes
  const purchasesCollection = dao.findCollectionByNameOrId("1kfrtrzsnyv1phg");
  purchasesCollection.schema.removeField("stripe_sess");
  purchasesCollection.schema.removeField("stripe_pi");
  dao.saveCollection(purchasesCollection);

  // Revert payment_logs
  const logsCollection = dao.findCollectionByNameOrId("paylog123456789");
  return dao.deleteCollection(logsCollection);
});
