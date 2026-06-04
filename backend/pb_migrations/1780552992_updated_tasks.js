/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("tasksssssssss")

  // remove
  collection.schema.removeField("fepwddx7")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "v0fryhmu",
    "name": "section_id",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "4lz8kjd31510eds",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("tasksssssssss")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fepwddx7",
    "name": "project_id",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "projectssssss",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // remove
  collection.schema.removeField("v0fryhmu")

  return dao.saveCollection(collection)
})
