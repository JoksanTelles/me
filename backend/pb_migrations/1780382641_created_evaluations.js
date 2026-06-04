/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "7rwrpzdojym2mh0",
    "created": "2026-06-02 06:44:01.234Z",
    "updated": "2026-06-02 06:44:01.234Z",
    "name": "evaluations",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "jfo3g750",
        "name": "lesson_id",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "i5e0b27g0gb820a",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "vdaq807f",
        "name": "questions",
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
        "id": "0lx4skeu",
        "name": "passingScore",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
        }
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "",
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("7rwrpzdojym2mh0");

  return dao.deleteCollection(collection);
})
