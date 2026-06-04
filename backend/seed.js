import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function ensureCollection(name, schemaDef) {
  try {
    const coll = await pb.collections.getOne(name);
    return await pb.collections.update(coll.id, { schema: schemaDef });
  } catch(e) {
    console.log(`Creating collection ${name}...`);
    return await pb.collections.create({
      name,
      type: 'base',
      schema: schemaDef
    });
  }
}

async function run() {
  console.log("Iniciando Seed...");
  
  // 1. Auth Admin
  try {
    const res = await pb.send('/api/admins/auth-with-password', { method: 'POST', body: { identity: 'admin@joksan.dev', password: '1234567890' } });
    pb.authStore.save(res.token, res.admin);
    console.log("Logueado como admin.");
  } catch(e) {
    console.log("Creando primer admin...");
    await pb.send('/api/admins', { method: 'POST', body: { email: 'admin@joksan.dev', password: '1234567890', passwordConfirm: '1234567890' } });
    const res2 = await pb.send('/api/admins/auth-with-password', { method: 'POST', body: { identity: 'admin@joksan.dev', password: '1234567890' } });
    pb.authStore.save(res2.token, res2.admin);
  }

  // 2. Collections
  const coursesColl = await ensureCollection('courses', [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true },
    { name: 'description', type: 'text' },
    { name: 'price', type: 'number' },
    { name: 'access_days', type: 'number' },
    { name: 'status', type: 'text' }
  ]);

  const sectionsColl = await ensureCollection('course_sections', [
    { name: 'course_id', type: 'relation', options: { collectionId: coursesColl.id, maxSelect: 1 } },
    { name: 'title', type: 'text', required: true },
    { name: 'order', type: 'number' }
  ]);

  const lessonsColl = await ensureCollection('lessons', [
    { name: 'section_id', type: 'relation', options: { collectionId: sectionsColl.id, maxSelect: 1 } },
    { name: 'title', type: 'text', required: true },
    { name: 'contentType', type: 'text' },
    { name: 'content', type: 'json', options: { maxSize: 2000000 } },
    { name: 'videoUrl', type: 'text' },
    { name: 'order', type: 'number' },
    { name: 'isFreePreview', type: 'bool' }
  ]);

  const assignmentsColl = await ensureCollection('assignments', [
    { name: 'lesson_id', type: 'relation', options: { collectionId: lessonsColl.id, maxSelect: 1 } },
    { name: 'title', type: 'text', required: true },
    { name: 'instructions', type: 'text' },
    { name: 'points', type: 'number' }
  ]);

  const projectsColl = await ensureCollection('projects', [
    { name: 'course_id', type: 'relation', options: { collectionId: coursesColl.id, maxSelect: 1 } },
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'text' },
    { name: 'order', type: 'number' }
  ]);

  const tasksColl = await ensureCollection('tasks', [
    { name: 'project_id', type: 'relation', options: { collectionId: projectsColl.id, maxSelect: 1 } },
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'text' },
    { name: 'order', type: 'number' }
  ]);

  const blogColl = await ensureCollection('blog', [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true },
    { name: 'content', type: 'json', options: { maxSize: 2000000 } },
    { name: 'status', type: 'text' }
  ]);

  // 3. Seed Courses
  console.log("Creando registros de prueba...");
  
  // Delete existing to avoid duplicates if re-running
  const existingCourses = await pb.collection('courses').getFullList();
  for (let c of existingCourses) await pb.collection('courses').delete(c.id);

  const c1 = await pb.collection('courses').create({
    title: 'Diseño Web Moderno',
    slug: 'diseno-web',
    description: 'Aprende a crear sitios web impresionantes con las últimas tecnologías. Domina Figma, Tailwind y Astro.',
    price: 49.99,
    status: 'published'
  });

  const c2 = await pb.collection('courses').create({
    title: 'Fundamentos de Java',
    slug: 'java-fundamentos',
    description: 'Desarrolla aplicaciones robustas y empresariales desde cero con Java y Spring Boot.',
    price: 59.99,
    status: 'published'
  });

  // Seed Sections & Lessons for Course 1
  const s1 = await pb.collection('course_sections').create({ course_id: c1.id, title: 'Módulo 1: Introducción', order: 1 });
  const l1 = await pb.collection('lessons').create({
    section_id: s1.id,
    title: 'Teoría del Color',
    order: 1,
    isFreePreview: true,
    content: { blocks: [{ type: 'paragraph', value: 'El color es clave para la interfaz.' }] },
    videoUrl: 'https://youtube.com/watch?v=mock1'
  });

  await pb.collection('assignments').create({
    lesson_id: l1.id,
    title: 'Crea tu Paleta de Colores',
    instructions: 'Sube una captura de tu paleta creada en Coolors.',
    points: 10
  });

  console.log("¡Base de datos sembrada correctamente!");
}

run().catch(err => {
  console.error("Error sembrando DB:", JSON.stringify(err.response || err, null, 2));
});
