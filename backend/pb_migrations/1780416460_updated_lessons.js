/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("i5e0b27g0gb820a")

  // remove
  collection.schema.removeField("wgq5iz51")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "contentType_new",
    "name": "contentType",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "video",
        "text",
        "resource",
        "quiz"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("i5e0b27g0gb820a")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wgq5iz51",
    "name": "videoUrl",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // remove
  collection.schema.removeField("contentType_new")

  return dao.saveCollection(collection)
})
