export const adminConfig = [
  { 
    id: 'courses', name: 'Cursos', 
    fields: [
      { name: 'title', type: 'text', label: 'Título' },
      { name: 'slug', type: 'text', label: 'URL Slug' },
      { name: 'description', type: 'text_long', label: 'Descripción' },
      { name: 'price', type: 'number', label: 'Precio' },
      { name: 'access_days', type: 'number', desc: 'Días de acceso (0 o vacío = sin límite de tiempo)', label: 'Días de acceso' },
      { name: 'status', type: 'select', options: ['published', 'draft', 'archived'], desc: 'Estado del curso', label: 'Estado' }
    ] 
  },
  { 
    id: 'purchases', name: 'Pedidos', 
    fields: [
      { name: 'user_id', type: 'relation', collection: 'users', display: 'email', label: 'Usuario' },
      { name: 'course_id', type: 'relation', collection: 'courses', display: 'title', label: 'Curso' },
      { name: 'amount', type: 'number', label: 'Monto' },
      { name: 'status', type: 'text', label: 'Estado' }
    ] 
  },
  {
    id: 'blog', name: 'Blog',
    fields: [
      { name: 'title', type: 'text', label: 'Título' },
      { name: 'slug', type: 'text', label: 'URL Slug' },
      { name: 'content', type: 'tiptap', label: 'Contenido' },
      { name: 'status', type: 'select', options: ['published', 'draft'], label: 'Estado' }
    ]
  },
  { 
    id: 'users', name: 'Usuarios', 
    fields: [
      { name: 'username', type: 'text', label: 'Nombre de usuario' },
      { name: 'email', type: 'text', label: 'Correo' },
      { name: 'name', type: 'text', label: 'Nombre' },
      { name: 'password', type: 'text', desc: 'Solo llenar si se desea cambiar la contraseña', label: 'Contraseña' }
    ] 
  },
  { 
    id: 'course_sections', name: 'Secciones', 
    fields: [
      { name: 'course_id', type: 'relation', collection: 'courses', display: 'title', hidden: true },
      { name: 'title', type: 'text', label: 'Título de la Sección' },
      { name: 'order', type: 'number', hidden: true }
    ] 
  },
  { 
    id: 'lessons', name: 'Lecciones', 
    fields: [
      { name: 'section_id', type: 'relation', collection: 'course_sections', display: 'title', hidden: true },
      { name: 'title', type: 'text', label: 'Título' },
      { name: 'contentType', type: 'select', options: ['video', 'text', 'resource', 'quiz'], label: 'Tipo de Contenido' },
      { name: 'content', type: 'tiptap', desc: 'Contenido visual de la lección', label: 'Contenido' },
      { name: 'order', type: 'number', hidden: true },
      { name: 'isFreePreview', type: 'boolean', label: 'Vista Previa Gratuita' }
    ] 
  },
  {
    id: 'projects', name: 'Proyectos',
    fields: [
      { name: 'course_id', type: 'relation', collection: 'courses', display: 'title', hidden: true },
      { name: 'title', type: 'text', label: 'Título' },
      { name: 'description', type: 'text_long', label: 'Descripción' },
      { name: 'order', type: 'number', hidden: true }
    ]
  },
  {
    id: 'tasks', name: 'Tareas',
    fields: [
      { name: 'project_id', type: 'relation', collection: 'projects', display: 'title', hidden: true },
      { name: 'title', type: 'text', label: 'Título' },
      { name: 'description', type: 'text_long', label: 'Descripción' },
      { name: 'order', type: 'number', hidden: true }
    ]
  }
];

export const getCollectionConfig = (id) => adminConfig.find(c => c.id === id);
