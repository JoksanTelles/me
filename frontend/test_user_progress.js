import PocketBase from 'pocketbase';
const pb = new PocketBase('http://127.0.0.1:8090');
async function run() {
  const authData = await pb.send('/api/admins/auth-with-password', {
    method: 'POST',
    body: { identity: 'admin@joksan.dev', password: '1234567890' }
  });
  pb.authStore.save(authData.token, authData.admin);
  const col = await pb.collections.getOne('user_progress');
  console.log(JSON.stringify(col.schema, null, 2));
}
run();
