/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "hpgsssykslne7bn",
    "created": "2026-06-05 08:04:15.995Z",
    "updated": "2026-06-05 08:04:15.995Z",
    "name": "project_submissions",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "ymv7p6ju",
        "name": "user_id",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": true,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "e4p0bi4j",
        "name": "project_id",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "projectssssss",
          "cascadeDelete": true,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "lgxo35j7",
        "name": "title",
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
        "id": "6b2iuwhb",
        "name": "description",
        "type": "editor",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "convertUrls": false
        }
      },
      {
        "system": false,
        "id": "hoaglcvk",
        "name": "link",
        "type": "url",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "exceptDomains": null,
          "onlyDomains": null
        }
      },
      {
        "system": false,
        "id": "hsidiexk",
        "name": "status",
        "type": "select",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "submitted",
            "graded",
            "returned"
          ]
        }
      }
    ],
    "indexes": [],
    "listRule": "@request.auth.id != '' && (@request.auth.id = user_id)",
    "viewRule": "@request.auth.id != '' && (@request.auth.id = user_id)",
    "createRule": "@request.auth.id != '' && @request.auth.id = user_id",
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("hpgsssykslne7bn");

  return dao.deleteCollection(collection);
})
