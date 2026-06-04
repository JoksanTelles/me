import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function ensureCollection(name, schemaDef) {
  try {
    const coll = await pb.collections.getOne(name);
    // make public
    await pb.collections.update(coll.id, { listRule: "", viewRule: "", createRule: "", updateRule: "" });
    return coll;
  } catch(e) {
    console.log(`Creating collection ${name}...`);
    return await pb.collections.create({
      name,
      type: 'base',
      listRule: "",
      viewRule: "",
      createRule: "",
      updateRule: "",
      schema: schemaDef
    });
  }
}

async function run() {
  await pb.admins.authWithPassword('admin@joksan.dev', '1234567890');
  
  const coursesColl = await pb.collections.getOne('courses');
  const lessonsColl = await pb.collections.getOne('lessons');

  // purchases
  await ensureCollection('purchases', [
    { name: 'user_id', type: 'relation', options: { collectionId: '_pb_users_auth_', maxSelect: 1 } },
    { name: 'course_id', type: 'relation', options: { collectionId: coursesColl.id, maxSelect: 1 } },
    { name: 'amount', type: 'number' },
    { name: 'status', type: 'text' }
  ]);

  // user_progress
  await ensureCollection('user_progress', [
    { name: 'user_id', type: 'relation', options: { collectionId: '_pb_users_auth_', maxSelect: 1 } },
    { name: 'lesson_id', type: 'relation', options: { collectionId: lessonsColl.id, maxSelect: 1 } },
    { name: 'isCompleted', type: 'bool' }
  ]);

  // evaluations
  const evalsColl = await ensureCollection('evaluations', [
    { name: 'lesson_id', type: 'relation', options: { collectionId: lessonsColl.id, maxSelect: 1 } },
    { name: 'questions', type: 'json', options: { maxSize: 2000000 } },
    { name: 'passingScore', type: 'number' }
  ]);

  // user_evaluations
  await ensureCollection('user_evaluations', [
    { name: 'user_id', type: 'relation', options: { collectionId: '_pb_users_auth_', maxSelect: 1 } },
    { name: 'evaluation_id', type: 'relation', options: { collectionId: evalsColl.id, maxSelect: 1 } },
    { name: 'score', type: 'number' },
    { name: 'isPassed', type: 'bool' }
  ]);
  
  // Set users auth collection to be readable/creatable
  const usersColl = await pb.collections.getOne('users');
  await pb.collections.update(usersColl.id, {
    listRule: "id = @request.auth.id",
    viewRule: "id = @request.auth.id",
    createRule: "",
    updateRule: "id = @request.auth.id"
  });

  // Seed Evaluation for Lesson 1
  const l1 = (await pb.collection('lessons').getFullList())[0];
  if (l1) {
    const existingEval = await pb.collection('evaluations').getFullList({ filter: `lesson_id = "${l1.id}"` });
    if (existingEval.length === 0) {
      await pb.collection('evaluations').create({
        lesson_id: l1.id,
        passingScore: 60,
        questions: [
          {
            question: "¿Cuál de los siguientes no es un color primario en RGB?",
            options: ["Rojo", "Amarillo", "Azul"],
            correctIndex: 1
          },
          {
            question: "¿Qué significa UX?",
            options: ["User Experience", "User Interface", "Universal Extractor"],
            correctIndex: 0
          }
        ]
      });
    }
  }

  console.log("¡Schemas adicionales creados!");
}

run().catch(err => console.error(err.response || err));
