migrate((db) => {
  const dao = new Dao(db);
  const collection = new Collection({
    id: "media_files_123",
    name: "media",
    type: "base",
    system: false,
    schema: [
      {
        id: "media_file",
        name: "file",
        type: "file",
        required: true,
        options: {
          maxSelect: 1,
          maxSize: 52428800, // 50MB
        }
      }
    ],
    listRule: "",
    viewRule: "",
    createRule: "@request.auth.id != '' || @request.auth.email ?= 'admin@'",
    updateRule: "@request.auth.id != '' || @request.auth.email ?= 'admin@'",
    deleteRule: "@request.auth.id != '' || @request.auth.email ?= 'admin@'"
  });
  dao.saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  try { dao.deleteCollection(dao.findCollectionByNameOrId("media")); } catch(e) {}
});
