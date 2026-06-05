import PocketBase from 'pocketbase';
const pb = new PocketBase('http://127.0.0.1:8090');
async function run() {
  const authData = await pb.send('/api/admins/auth-with-password', {
    method: 'POST',
    body: { identity: 'admin@joksan.dev', password: '1234567890' }
  });
  pb.authStore.save(authData.token, authData.admin);
  try {
    const p = await pb.collection('purchases').getList(1, 5, { sort: '-created', expand: 'user_id,course_id' });
    console.log("Purchases success:", p.totalItems);
  } catch(e) {
    console.log("Purchases error:", e.response);
  }
}
run();
