import PocketBase from 'pocketbase';
const pb = new PocketBase('http://127.0.0.1:8090');
async function test() {
  try {
    await pb.admins.authWithPassword('admin@joksan.dev', '1234567890');
    console.log("Auth OK");
  } catch(e) {
    console.log("Auth Failed:", e.response);
    try {
      await pb.admins.create({ email: 'admin@joksan.dev', password: '1234567890', passwordConfirm: '1234567890' });
      console.log("Create OK");
    } catch(e2) {
      console.log("Create Failed:", JSON.stringify(e2.response, null, 2));
    }
  }
}
test();
