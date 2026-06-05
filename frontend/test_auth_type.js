import PocketBase from 'pocketbase';
const pb = new PocketBase('http://127.0.0.1:8090');
async function run() {
  const authData = await pb.send('/api/admins/auth-with-password', {
    method: 'POST',
    body: { identity: 'admin@joksan.dev', password: '1234567890' }
  });
  pb.authStore.save(authData.token, authData.admin);
  console.log("Is Admin Superuser?", pb.authStore.isSuperuser);
  console.log("Is Admin AuthRecord?", pb.authStore.isAuthRecord);
  console.log("Token Payload:", pb.authStore.model || pb.authStore.record);
  
  pb.authStore.clear();
  
  try {
    const userAuth = await pb.collection('users').authWithPassword('joksantelles@gmail.com', '1234567890');
    console.log("Is User Superuser?", pb.authStore.isSuperuser);
    console.log("Is User AuthRecord?", pb.authStore.isAuthRecord);
  } catch(e) {
    console.log("User auth failed", e.response);
  }
}
run();
