/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("lessons");

  // Remove videoUrl field
  const field = collection.schema.getFieldByName("videoUrl");
  if (field) {
    collection.schema.removeField(field.id);
    return dao.saveCollection(collection);
  }
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("lessons");
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "videourl_id_restore",
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
  }));
  return dao.saveCollection(collection);
});
