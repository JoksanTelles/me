/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "nahalnt28wbnulm",
    "created": "2026-06-05 07:48:21.828Z",
    "updated": "2026-06-05 07:48:21.828Z",
    "name": "task_submissions",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "wttapstd",
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
        "id": "olod1lit",
        "name": "task_id",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "tasksssssssss",
          "cascadeDelete": true,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "oks454xj",
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
        "id": "d2hjkyda",
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
        "id": "y7gz4ive",
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
        "id": "cjllbers",
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
  const collection = dao.findCollectionByNameOrId("nahalnt28wbnulm");

  return dao.deleteCollection(collection);
})
