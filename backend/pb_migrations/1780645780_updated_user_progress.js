/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4cpdoeq3g3v3sj1")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gjj7mgeh",
    "name": "quiz_id",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "h38cp7yu3bzs19l",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xkw24yrw",
    "name": "task_id",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "tasksssssssss",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "anuxyiue",
    "name": "project_id",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "projectssssss",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "hghuldb5",
    "name": "score",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ekmyqgmh",
    "name": "passed",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "p6rdpku1",
    "name": "quiz_answers",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4cpdoeq3g3v3sj1")

  // remove
  collection.schema.removeField("gjj7mgeh")

  // remove
  collection.schema.removeField("xkw24yrw")

  // remove
  collection.schema.removeField("anuxyiue")

  // remove
  collection.schema.removeField("hghuldb5")

  // remove
  collection.schema.removeField("ekmyqgmh")

  // remove
  collection.schema.removeField("p6rdpku1")

  return dao.saveCollection(collection)
})
