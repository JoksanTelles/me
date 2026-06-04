const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function run() {
  await pb.admins.authWithPassword('admin@joksan.dev', '1234567890');
  
  // 1. Update courses collection
  try {
    const courseColl = await pb.collections.getOne('courses');
    const newFields = [
      { name: 'cover', type: 'file', options: { maxSelect: 1, maxSize: 5242880, mimeTypes: ['image/jpeg', 'image/png', 'image/webp'] } },
      { name: 'meta_title', type: 'text', options: { max: 255 } },
      { name: 'meta_description', type: 'text', options: { max: 500 } },
      { name: 'discount_price', type: 'number', options: { min: 0 } },
      { name: 'discount_start', type: 'date', options: {} },
      { name: 'discount_end', type: 'date', options: {} }
    ];
    
    let schema = courseColl.schema;
    newFields.forEach(nf => {
      if (!schema.find(f => f.name === nf.name)) {
        schema.push(Object.assign({ required: false, id: Math.random().toString(36).substring(2, 10), system: false, unique: false }, nf));
      }
    });
    
    await pb.collections.update('courses', { schema });
    console.log('Courses updated');
  } catch(e) { console.error('Error updating courses', e?.response || e); }

  // 2. Update tasks collection
  try {
    const taskColl = await pb.collections.getOne('tasks');
    let schema = taskColl.schema;
    // remove project_id
    schema = schema.filter(f => f.name !== 'project_id');
    // add section_id
    if (!schema.find(f => f.name === 'section_id')) {
      schema.push({
        id: Math.random().toString(36).substring(2, 10),
        name: 'section_id',
        type: 'relation',
        required: true,
        system: false,
        unique: false,
        options: { collectionId: (await pb.collections.getOne('course_sections')).id, cascadeDelete: true, maxSelect: 1 }
      });
    }
    await pb.collections.update('tasks', { schema });
    console.log('Tasks updated');
  } catch(e) { console.error('Error updating tasks', e?.response || e); }

  // 3. Create quizzes collection
  try {
    await pb.collections.create({
      name: 'quizzes',
      type: 'base',
      schema: [
        { name: 'title', type: 'text', required: true },
        { name: 'questions', type: 'json', required: false },
        { name: 'section_id', type: 'relation', required: true, options: { collectionId: (await pb.collections.getOne('course_sections')).id, cascadeDelete: true, maxSelect: 1 } },
        { name: 'order', type: 'number', required: false }
      ]
    });
    console.log('Quizzes created');
  } catch(e) { console.error('Quizzes might exist', e?.response?.data || e.message); }

  // 4. Create reviews collection
  try {
    await pb.collections.create({
      name: 'reviews',
      type: 'base',
      schema: [
        { name: 'course_id', type: 'relation', required: true, options: { collectionId: (await pb.collections.getOne('courses')).id, cascadeDelete: true, maxSelect: 1 } },
        { name: 'user_id', type: 'relation', required: true, options: { collectionId: (await pb.collections.getOne('users')).id, cascadeDelete: true, maxSelect: 1 } },
        { name: 'rating', type: 'number', required: true, options: { min: 1, max: 5 } },
        { name: 'comment', type: 'text', required: false }
      ]
    });
    console.log('Reviews created');
  } catch(e) { console.error('Reviews might exist', e?.response?.data || e.message); }

}
run();
