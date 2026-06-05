import PocketBase from 'pocketbase';
const pb = new PocketBase('http://127.0.0.1:8090');
async function run() {
  const authData = await pb.send('/api/admins/auth-with-password', {
    method: 'POST',
    body: { identity: 'admin@joksan.dev', password: '1234567890' }
  });
  
  // Serialize like exportToCookie
  const cookieStr = JSON.stringify({ token: authData.token, record: authData.admin });
  
  // Deserialize like loadFromCookie
  const n = JSON.parse(cookieStr);
  pb.authStore.save(n.token || "", n.record || n.model || null);
  
  try {
    const users = await pb.collection('users').getList(1, 5);
    console.log("Success! Users count:", users.totalItems);
  } catch(e) {
    console.log("Error:", e.response);
  }
}
run();
