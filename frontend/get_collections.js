import PocketBase from 'pocketbase';
const pb = new PocketBase('http://127.0.0.1:8090');
async function run() {
  const authData = await pb.send('/api/admins/auth-with-password', {
    method: 'POST',
    body: { identity: 'admin@joksan.dev', password: '1234567890' }
  });
  pb.authStore.save(authData.token, authData.admin);
  const collections = await pb.collections.getFullList();
  const tasksCol = collections.find(c => c.name === 'tasks');
  const usersCol = collections.find(c => c.name === 'users');
  console.log("Tasks ID:", tasksCol.id);
  console.log("Users ID:", usersCol.id);
}
run();
