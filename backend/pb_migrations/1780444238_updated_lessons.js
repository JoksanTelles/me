/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("i5e0b27g0gb820a")

  // remove
  collection.schema.removeField("mlsiul9a")

  // remove
  collection.schema.removeField("qigzvgzt")

  // remove
  collection.schema.removeField("upedzoyx")

  // remove
  collection.schema.removeField("vf4dfqvq")

  // remove
  collection.schema.removeField("ryrg7wzv")

  // remove
  collection.schema.removeField("contentType_new")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wrrcfmka",
    "name": "section_id",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "4lz8kjd31510eds",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cahiepgb",
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
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wb85fjp4",
    "name": "contentType",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jc7gbcrw",
    "name": "content",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "kaxie94z",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mxyaeyd7",
    "name": "order",
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
    "id": "8ffutu5y",
    "name": "isFreePreview",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("i5e0b27g0gb820a")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mlsiul9a",
    "name": "section_id",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "4lz8kjd31510eds",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qigzvgzt",
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
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "upedzoyx",
    "name": "content",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vf4dfqvq",
    "name": "order",
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
    "id": "ryrg7wzv",
    "name": "isFreePreview",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

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

  // remove
  collection.schema.removeField("wrrcfmka")

  // remove
  collection.schema.removeField("cahiepgb")

  // remove
  collection.schema.removeField("wb85fjp4")

  // remove
  collection.schema.removeField("jc7gbcrw")

  // remove
  collection.schema.removeField("kaxie94z")

  // remove
  collection.schema.removeField("mxyaeyd7")

  // remove
  collection.schema.removeField("8ffutu5y")

  return dao.saveCollection(collection)
})
