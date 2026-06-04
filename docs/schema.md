# Documentación de Arquitectura y Base de Datos

## Arquitectura Monorepo
El proyecto utiliza una estructura de monorepositorio con dos partes claramente separadas:
- **Backend (`/backend`)**: Servidor Pocketbase alojado en un VPS. Gestiona la autenticación, base de datos de productos (cursos), clientes, y compras.
- **Frontend (`/frontend`)**: Aplicación web construida con Vue.js + Astro, la cual se compila y aloja en Cloudflare Pages de manera estática y eficiente.

---

## Esquema de Base de Datos (Pocketbase)

Pocketbase utiliza SQLite por detrás y su API provee autenticación de usuarios por defecto. 
A continuación se detalla el esquema de las colecciones a crear:

### 1. Colección `users` (Viene por defecto)
Gestiona el acceso de clientes y administradores.
- `id` (Text, Primary Key)
- `email` (Email) - Correo del usuario.
- `emailVisibility` (Boolean)
- `password` (Password) - Contraseña (encriptada automáticamente).
- `name` (Text) - Nombre completo del usuario.
- `avatar` (File) - Opcional, foto de perfil.
- `created`, `updated` (DateTime)

### 2. Colección `courses` (Anteriormente Products)
Almacena la información principal de cada curso (el "producto" que los usuarios compran).
- `id` (Text, Primary Key)
- `title` (Text) - Ej: "Diseño web moderno".
- `slug` (Text, Unique) - Para URLs amigables.
- `description` (Text) - Descripción detallada.
- `price` (Number) - Precio del curso.
- `coverImage` (File) - Imagen representativa.
- `status` (Select: `draft`, `published`, `archived`) - Recomendado para ocultar cursos en desarrollo.
- `created`, `updated` (DateTime)

### 3. Colección `course_sections`
Agrupa las lecciones dentro de un curso (Módulos/Capítulos).
- `id` (Text, Primary Key)
- `course_id` (Relation -> `courses`)
- `title` (Text) - Ej: "Introducción", "Conceptos Avanzados".
- `order` (Number) - Para ordenar las secciones en el índice.
- `created`, `updated` (DateTime)

### 4. Colección `lessons`
Contiene la información y el contenido individual de cada lección.
- `id` (Text, Primary Key)
- `section_id` (Relation -> `course_sections`)
- `title` (Text) - Título de la lección.
- `content` (JSON) - Bloques de contenido de la lección (textos, código, imágenes, links).
- `videoUrl` (Text) - URL del video incrustado (Vimeo, YouTube, o R2), opcional.
- `order` (Number) - Orden de la lección dentro de la sección.
- `isFreePreview` (Boolean) - Si es verdadero, permite verla sin haber comprado el curso.
- `created`, `updated` (DateTime)

### 5. Colección `purchases`
Registra si un usuario ha comprado el curso. Autoriza el acceso al contenido.
- `id` (Text, Primary Key)
- `user_id` (Relation -> `users`)
- `course_id` (Relation -> `courses`)
- `status` (Select: `pending`, `completed`, `refunded`)
- `created`, `updated` (DateTime)

### 6. Colección `user_progress`
Guarda el estado de avance de un usuario para cada lección.
- `id` (Text, Primary Key)
- `user_id` (Relation -> `users`)
- `lesson_id` (Relation -> `lessons`)
- `isCompleted` (Boolean) - Si el usuario marcó la lección como terminada.
- `created`, `updated` (DateTime)

### 7. Colección `certificates`
Se genera cuando un usuario tiene el 100% de `user_progress` para un curso.
- `id` (Text, Primary Key)
- `user_id` (Relation -> `users`)
- `course_id` (Relation -> `courses`)
- `certificate_hash` (Text, Unique) - Identificador único público para validar el certificado.
- `issuedAt` (DateTime) - Fecha de emisión.
- `created`, `updated` (DateTime)

### 9. Colección `evaluations`
Contiene los cuestionarios o exámenes vinculados a una lección o al curso general.
- `id` (Text, Primary Key)
- `lesson_id` (Relation -> `lessons`) - Opcional si es un examen global.
- `questions` (JSON) - Array de preguntas con sus opciones y respuestas correctas.
- `passingScore` (Number) - Porcentaje o puntaje mínimo para aprobar.
- `created`, `updated` (DateTime)

### 10. Colección `user_evaluations`
Registra los intentos y calificaciones de los usuarios en los exámenes.
- `id` (Text, Primary Key)
- `user_id` (Relation -> `users`)
- `evaluation_id` (Relation -> `evaluations`)
- `score` (Number) - Puntuación obtenida.
- `isPassed` (Boolean) - Si superó el `passingScore`.
- `created`, `updated` (DateTime)
### 8. Colección `notifications`
Alertas del sistema para el usuario (nuevos cursos, respuestas de soporte, recordatorios).
- `id` (Text, Primary Key)
- `user_id` (Relation -> `users`)
- `title` (Text)
- `message` (Text)
- `actionUrl` (Text) - Enlace opcional (ej: al nuevo curso).
- `isRead` (Boolean) - Si el usuario ya la vio.
- `created`, `updated` (DateTime)

---

## 💡 Recomendaciones Críticas para el Esquema

1. **Gestión de Roles (`users`):**
   - Agrega un campo `role` (Select: `admin`, `student`) en la colección `users`. Te permitirá crear **API Rules** en Pocketbase fácilmente (Ej: Solo los usuarios con rol `admin` pueden crear lecciones).
2. **API Rules Robustas:**
   - En la colección `lessons`, configura la regla de lectura (`View Rule`) para que el contenido solo sea devuelto si `isFreePreview = true` o si existe un registro `completed` en la colección `purchases` que coincida con el `user_id` solicitante y el `course_id`.
3. **Manejo del JSON en Lecciones:**
   - Define un esquema estándar para el campo `content` (JSON) en tu Frontend. Por ejemplo, un array de bloques: `[{ "type": "paragraph", "value": "Texto..." }, { "type": "code", "lang": "java", "value": "System.out.println()" }]`.
4. **Campos "Soft Delete":**
   - En lugar de eliminar registros reales (lo que destruiría los `user_progress` vinculados), es preferible agregar un campo `isDeleted` (Boolean) en `courses` y `lessons` para ocultarlos de la vista pública pero preservar el historial de base de datos.
5. **Índices de Base de Datos:**
   - Desde la interfaz de Pocketbase, crea **índices únicos** compuestos. Por ejemplo, en `user_progress`, crea un índice único con `user_id` y `lesson_id` para garantizar que no existan registros duplicados de progreso para la misma lección.

---

## Identidad Visual y Diseño
- **Fuente de Títulos**: Impact
- **Fuente de Párrafos**: Readex Pro
- **Color Primario**: Rose (Tailwind)
- **Escala de Grises**: Taupe (Tailwind)

Se utilizará una página sencilla tipo "Link-in-bio" para mostrar los cursos, y un panel de Login/Signup sencillo y amigable.
