import PocketBase from 'pocketbase';
const pb = new PocketBase('http://127.0.0.1:8090');
async function run() {
  const authData = await pb.send('/api/admins/auth-with-password', {
    method: 'POST',
    body: { identity: 'admin@joksan.dev', password: '1234567890' }
  });
  pb.authStore.save(authData.token, authData.admin);

  try {
    await pb.collections.create({
      name: 'task_submissions',
      type: 'base',
      system: false,
      schema: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          options: { collectionId: '_pb_users_auth_', cascadeDelete: true, maxSelect: 1 }
        },
        {
          name: 'task_id',
          type: 'relation',
          required: true,
          options: { collectionId: 'tasksssssssss', cascadeDelete: true, maxSelect: 1 }
        },
        {
          name: 'title',
          type: 'text',
          required: true
        },
        {
          name: 'description',
          type: 'editor',
          required: false
        },
        {
          name: 'link',
          type: 'url',
          required: false
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          options: { maxSelect: 1, values: ["submitted", "graded", "returned"] }
        }
      ],
      listRule: "@request.auth.id != '' && (@request.auth.id = user_id)",
      viewRule: "@request.auth.id != '' && (@request.auth.id = user_id)",
      createRule: "@request.auth.id != '' && @request.auth.id = user_id",
      updateRule: null,
      deleteRule: null
    });
    console.log("Collection task_submissions created!");
  } catch (e) {
    console.log(JSON.stringify(e.response, null, 2));
  }
}
run();
