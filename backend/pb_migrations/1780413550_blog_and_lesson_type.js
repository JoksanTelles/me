/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  
  // 1. Add contentType to lessons
  const lessons = dao.findCollectionByNameOrId("lessons");
  lessons.schema.addField(new SchemaField({
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
        "downloadable",
        "quiz"
      ]
    }
  }));
  dao.saveCollection(lessons);

  // Set default value for existing lessons
  db.newQuery("UPDATE lessons SET contentType = 'text' WHERE contentType = '' OR contentType IS NULL").execute();

  // 2. Create blog collection
  const blogCollection = new Collection({
    "id": "blog1234567890",
    "name": "blog",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "blog_title",
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
        "id": "blog_slug",
        "name": "slug",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": true,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "blog_content",
        "name": "content",
        "type": "editor",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "blog_status",
        "name": "status",
        "type": "select",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": ["published", "draft"]
        }
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return dao.saveCollection(blogCollection);

}, (db) => {
  const dao = new Dao(db);
  
  const lessons = dao.findCollectionByNameOrId("lessons");
  lessons.schema.removeField("contentType_new");
  dao.saveCollection(lessons);

  const blogCollection = dao.findCollectionByNameOrId("blog1234567890");
  if (blogCollection) {
    dao.deleteCollection(blogCollection);
  }
});
