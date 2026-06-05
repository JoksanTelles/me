import PocketBase from 'pocketbase';
const pb = new PocketBase('http://127.0.0.1:8090');
async function run() {
  const authData = await pb.send('/api/admins/auth-with-password', {
    method: 'POST',
    body: { identity: 'admin@joksan.dev', password: '1234567890' }
  });
  pb.authStore.save(authData.token, authData.admin);
  const col = await pb.collections.getOne('user_progress');
  
  col.schema.push({ name: 'quiz_id', type: 'relation', required: false, options: { collectionId: 'h38cp7yu3bzs19l', cascadeDelete: true, maxSelect: 1 } });
  col.schema.push({ name: 'task_id', type: 'relation', required: false, options: { collectionId: 'tasksssssssss', cascadeDelete: true, maxSelect: 1 } });
  col.schema.push({ name: 'project_id', type: 'relation', required: false, options: { collectionId: 'projectssssss', cascadeDelete: true, maxSelect: 1 } });
  col.schema.push({ name: 'score', type: 'number', required: false, options: {} });
  col.schema.push({ name: 'passed', type: 'bool', required: false, options: {} });
  col.schema.push({ name: 'quiz_answers', type: 'json', required: false, options: {} });

  try {
    await pb.collections.update('user_progress', col);
    console.log("Updated user_progress!");
  } catch(e) {
    console.log(JSON.stringify(e.response, null, 2));
  }
}
run();
