import PocketBase from 'pocketbase';
const pbAdmin = new PocketBase('http://127.0.0.1:8090');
const authData = await pbAdmin.send('/api/admins/auth-with-password', {
  method: 'POST',
  body: { identity: 'admin@joksan.dev', password: '1234567890' }
});
pbAdmin.authStore.save(authData.token, authData.admin);
console.log("Token length:", pbAdmin.authStore.token?.length);
try {
  await pbAdmin.collection('purchases').getList(1, 1);
  console.log("Success fetching purchases");
} catch(e) {
  console.error("Error:", e.message, e.status);
}
