migrate((db) => {
  const dao = new Dao(db);
  const courseCollection = dao.findCollectionByNameOrId("courses");
  courseCollection.schema.addField(new SchemaField({
    "system": false,
    "id": "course_access_days",
    "name": "access_days",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": true
    }
  }));
  dao.saveCollection(courseCollection);

  const purchaseCollection = dao.findCollectionByNameOrId("purchases");
  purchaseCollection.schema.addField(new SchemaField({
    "system": false,
    "id": "purchase_expires_at",
    "name": "expires_at",
    "type": "date",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }));
  dao.saveCollection(purchaseCollection);
}, (db) => {
  const dao = new Dao(db);
  const courseCollection = dao.findCollectionByNameOrId("courses");
  courseCollection.schema.removeField("course_access_days");
  dao.saveCollection(courseCollection);

  const purchaseCollection = dao.findCollectionByNameOrId("purchases");
  purchaseCollection.schema.removeField("purchase_expires_at");
  dao.saveCollection(purchaseCollection);
});
