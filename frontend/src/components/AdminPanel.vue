<template>
  <div v-if="!isLoggedIn" class="min-h-screen bg-stone-100 flex items-center justify-center p-4">
    <div class="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm border border-stone-200">
      <h1 class="font-title text-3xl text-rose-950 uppercase mb-2 text-center">Panel Admin</h1>
      <p class="text-stone-500 text-sm mb-6 text-center">Ingresa con tus credenciales maestras.</p>
      
      <div v-if="error" class="bg-red-100 text-red-700 p-3 rounded-xl text-sm mb-4">{{ error }}</div>
      
      <form @submit.prevent="login" class="flex flex-col gap-4">
        <div>
          <label class="block text-sm font-bold text-stone-700 mb-1">Email</label>
          <input v-model="email" type="email" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-rose-400" required>
        </div>
        <div>
          <label class="block text-sm font-bold text-stone-700 mb-1">Contraseña</label>
          <input v-model="password" type="password" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-rose-400" required>
        </div>
        <button type="submit" class="mt-2 bg-stone-900 hover:bg-black text-white font-bold py-3 rounded-xl uppercase tracking-wide transition-all">Ingresar</button>
      </form>
    </div>
  </div>

  <div v-else class="min-h-screen bg-stone-50 flex font-sans text-stone-900">
    <!-- Sidebar -->
    <aside class="w-64 bg-stone-900 text-stone-300 flex flex-col fixed h-full z-20">
      <div class="p-6">
        <h2 class="font-title text-2xl text-white uppercase tracking-wider mb-1">Joksan Admin</h2>
        <p class="text-xs text-rose-400 font-bold uppercase">Gestor de Plataforma</p>
      </div>
      
      <nav class="flex-1 overflow-y-auto py-4">
        <ul class="space-y-1">
          <li>
            <button @click="openView('dashboard')" class="w-full text-left px-6 py-3 transition-colors uppercase text-sm tracking-wide font-bold" :class="activeView === 'dashboard' ? 'bg-rose-600 text-white' : 'hover:bg-stone-800 hover:text-white'">
              Dashboard
            </button>
          </li>
          <li>
            <button @click="openCollection('courses')" class="w-full text-left px-6 py-3 transition-colors uppercase text-sm tracking-wide font-bold" :class="(activeView === 'collection' && activeCol?.id === 'courses') || activeView === 'courseManager' ? 'bg-rose-600 text-white' : 'hover:bg-stone-800 hover:text-white'">
              Cursos
            </button>
          </li>
          <li>
            <button @click="openCollection('purchases')" class="w-full text-left px-6 py-3 transition-colors uppercase text-sm tracking-wide font-bold" :class="activeView === 'collection' && activeCol?.id === 'purchases' ? 'bg-rose-600 text-white' : 'hover:bg-stone-800 hover:text-white'">
              Pedidos
            </button>
          </li>
          <li>
            <button @click="openCollection('blog')" class="w-full text-left px-6 py-3 transition-colors uppercase text-sm tracking-wide font-bold" :class="activeView === 'collection' && activeCol?.id === 'blog' ? 'bg-rose-600 text-white' : 'hover:bg-stone-800 hover:text-white'">
              Blog
            </button>
          </li>
          <li>
            <button @click="openCollection('users')" class="w-full text-left px-6 py-3 transition-colors uppercase text-sm tracking-wide font-bold" :class="activeView === 'collection' && activeCol?.id === 'users' ? 'bg-rose-600 text-white' : 'hover:bg-stone-800 hover:text-white'">
              Usuarios
            </button>
          </li>
        </ul>
      </nav>

      <div class="p-4 border-t border-stone-800">
        <button @click="logout" class="w-full text-left px-4 py-2 text-stone-400 hover:text-white transition-colors text-sm font-bold">Cerrar Sesión</button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 ml-64 p-8 relative h-screen overflow-y-auto">
      
      <!-- DASHBOARD -->
      <div v-if="activeView === 'dashboard'" class="max-w-4xl mx-auto">
        <h1 class="font-title text-4xl text-stone-900 uppercase mb-2">Bienvenido, Admin</h1>
        <p class="text-stone-500 mb-8">Resumen rápido de la plataforma.</p>
        
        <div class="grid grid-cols-3 gap-6">
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
            <h3 class="text-stone-500 text-sm font-bold uppercase tracking-wide">Usuarios Registrados</h3>
            <p class="text-4xl font-title mt-2">{{ relationsData.users.length }}</p>
          </div>
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
            <h3 class="text-stone-500 text-sm font-bold uppercase tracking-wide">Cursos Creados</h3>
            <p class="text-4xl font-title mt-2">{{ relationsData.courses.length }}</p>
          </div>
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
            <h3 class="text-stone-500 text-sm font-bold uppercase tracking-wide">Pedidos Totales</h3>
            <p class="text-4xl font-title mt-2">{{ totalPurchases }}</p>
          </div>
        </div>
      </div>

      <!-- COURSE MANAGER (Advanced UX) -->
      <div v-else-if="activeView === 'courseManager' && builderCourse" class="max-w-4xl mx-auto pb-20">
        <button @click="openCollection('courses')" class="text-stone-500 hover:text-rose-600 mb-6 font-bold uppercase text-sm flex items-center gap-2">
          ← Volver a Cursos
        </button>
        <div class="flex justify-between items-end mb-6">
          <div>
            <h1 class="font-title text-4xl text-stone-900 uppercase">Administrar Curso</h1>
            <p class="text-stone-500 mt-1">{{ builderCourse.title }}</p>
          </div>
          <div class="bg-white rounded-lg shadow-sm border border-stone-200 flex p-1">
            <button @click="courseTab = 'info'" :class="courseTab === 'info' ? 'bg-stone-900 text-white' : 'text-stone-500 hover:text-stone-800'" class="px-4 py-2 rounded font-bold uppercase text-xs tracking-wide transition-colors">Información</button>
            <button @click="courseTab = 'content'" :class="courseTab === 'content' ? 'bg-stone-900 text-white' : 'text-stone-500 hover:text-stone-800'" class="px-4 py-2 rounded font-bold uppercase text-xs tracking-wide transition-colors">Contenido</button>
            <button @click="courseTab = 'projects'" :class="courseTab === 'projects' ? 'bg-stone-900 text-white' : 'text-stone-500 hover:text-stone-800'" class="px-4 py-2 rounded font-bold uppercase text-xs tracking-wide transition-colors">Proyectos</button>
            <button @click="courseTab = 'config'" :class="courseTab === 'config' ? 'bg-stone-900 text-white' : 'text-stone-500 hover:text-stone-800'" class="px-4 py-2 rounded font-bold uppercase text-xs tracking-wide transition-colors">Configuración</button>
          </div>
        </div>

        <!-- Tab: Información -->
        <div v-if="courseTab === 'info'" class="bg-white rounded-3xl p-8 shadow-sm border border-stone-200">
          <h2 class="font-title text-2xl text-stone-800 uppercase mb-6">Información General</h2>
          <form @submit.prevent="saveCourseInfo" class="space-y-6">
            <div>
              <label class="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-wide">Título</label>
              <input v-model="courseFormData.title" type="text" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-rose-400">
            </div>
            <div>
              <label class="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-wide">Slug</label>
              <input v-model="courseFormData.slug" type="text" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-rose-400 font-mono text-sm text-stone-500">
            </div>
            <div>
              <label class="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-wide">Descripción</label>
              <textarea v-model="courseFormData.description" rows="5" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-rose-400 font-mono text-sm"></textarea>
            </div>
            <div class="flex justify-end border-t border-stone-100 pt-6 mt-6">
              <button type="submit" :disabled="saving" class="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-wide shadow-md transition-colors disabled:opacity-50">
                {{ saving ? 'Guardando...' : 'Guardar Información' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Tab: Configuración -->
        <div v-if="courseTab === 'config'" class="bg-white rounded-3xl p-8 shadow-sm border border-stone-200">
          <h2 class="font-title text-2xl text-stone-800 uppercase mb-6">Configuración de Venta</h2>
          <form @submit.prevent="saveCourseInfo" class="space-y-6">
            <div>
              <label class="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-wide">Precio ($)</label>
              <input v-model.number="courseFormData.price" type="number" step="0.01" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-rose-400">
              <p class="text-xs text-stone-400 mt-1">Coloca 0 para hacerlo gratuito y saltar la pantalla de pago.</p>
            </div>
            <div>
              <label class="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-wide">Estado</label>
              <select v-model="courseFormData.status" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-rose-400">
                <option value="draft">Borrador (Oculto)</option>
                <option value="published">Publicado (Visible)</option>
                <option value="archived">Archivado (Solo lectura para alumnos existentes)</option>
              </select>
            </div>
            <div class="flex justify-end border-t border-stone-100 pt-6 mt-6">
              <button type="submit" :disabled="saving" class="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-wide shadow-md transition-colors disabled:opacity-50">
                {{ saving ? 'Guardando...' : 'Guardar Configuración' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Tab: Contenido -->
        <div v-if="courseTab === 'content'">
          <div class="flex justify-between items-center mb-6">
            <h2 class="font-title text-2xl text-stone-800 uppercase">Constructor de Contenido</h2>
            <button @click="openBuilderModal('course_sections', null, { course_id: builderCourse.id, order: builderData.sections.length })" class="bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded-lg shadow-md uppercase text-sm">
              + Añadir Sección
            </button>
          </div>

          <div v-if="builderData.sections.length === 0" class="bg-white rounded-2xl p-12 text-center border border-stone-200">
            <p class="text-stone-400 mb-4">Este curso no tiene contenido aún.</p>
            <button @click="openBuilderModal('course_sections', null, { course_id: builderCourse.id, order: 0 })" class="text-rose-500 font-bold uppercase text-sm hover:underline">Añadir tu primera sección</button>
          </div>

          <draggable 
            v-model="builderData.sections" 
            item-key="id" 
            handle=".drag-handle-section" 
            class="space-y-6"
            @end="saveSectionOrder"
          >
            <template #item="{ element: section, index }">
              <div class="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                <div class="bg-stone-50 p-4 border-b border-stone-200 flex justify-between items-center">
                  <div class="flex items-center gap-3">
                    <button class="drag-handle-section text-stone-300 hover:text-stone-600 cursor-grab text-xl leading-none">≡</button>
                    <span class="text-stone-400 font-mono text-sm border border-stone-300 rounded px-2">{{ index + 1 }}</span>
                    <h3 class="font-title text-xl text-stone-800 uppercase">{{ section.title }}</h3>
                  </div>
                  <div class="flex gap-3 items-center">
                    <button @click="openBuilderModal('course_sections', section)" class="text-stone-400 hover:text-rose-500 text-sm font-bold uppercase">Editar</button>
                    <div class="h-4 w-px bg-stone-300"></div>
                    <button @click="openBuilderModal('lessons', null, { section_id: section.id, order: section.lessons.length, contentType: 'text' })" class="text-stone-600 hover:text-stone-900 text-sm font-bold uppercase">+ Lección</button>
                    <button @click="openBuilderModal('lessons', null, { section_id: section.id, order: section.lessons.length, contentType: 'quiz' })" class="text-rose-500 hover:text-rose-700 text-sm font-bold uppercase">+ Quiz</button>
                  </div>
                </div>

                <!-- Lessons & Quizzes -->
                <div class="p-4">
                  <draggable 
                    v-model="section.lessons" 
                    item-key="id" 
                    handle=".drag-handle-lesson"
                    @end="saveLessonOrder(section)"
                    class="space-y-3"
                  >
                    <template #item="{ element: lesson, index: lIndex }">
                      <div class="border border-stone-100 rounded-xl p-3 flex justify-between items-center hover:border-stone-300 transition-colors bg-white group">
                        <div class="flex items-center gap-3">
                          <button class="drag-handle-lesson text-stone-300 hover:text-stone-600 cursor-grab text-xl leading-none">≡</button>
                          <span class="text-stone-300 font-mono text-xs">{{ lIndex + 1 }}</span>
                          
                          <span v-if="lesson.contentType === 'quiz'" class="text-purple-500 font-bold bg-purple-50 px-2 py-0.5 rounded text-xs uppercase">Quiz</span>
                          <span v-else-if="lesson.contentType === 'video'" class="text-blue-500 font-bold bg-blue-50 px-2 py-0.5 rounded text-xs uppercase">Video</span>
                          <span v-else-if="lesson.contentType === 'resource'" class="text-green-500 font-bold bg-green-50 px-2 py-0.5 rounded text-xs uppercase">Descargable</span>
                          <span v-else class="text-stone-500 font-bold bg-stone-100 px-2 py-0.5 rounded text-xs uppercase">Texto</span>
                          
                          <span class="text-stone-700 font-bold">{{ lesson.title }}</span>
                          <span v-if="lesson.isFreePreview" class="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full uppercase font-bold">Gratis</span>
                        </div>
                        <div class="flex items-center gap-4">
                          <button @click="openBuilderModal('lessons', lesson)" class="text-stone-400 hover:text-stone-700 text-xs font-bold uppercase">Editar</button>
                        </div>
                      </div>
                    </template>
                  </draggable>
                  <p v-if="section.lessons.length === 0" class="text-sm text-stone-400 pl-8 italic mt-3">Sin contenido en esta sección.</p>
                </div>
              </div>
            </template>
          </draggable>
        </div>
        
        <!-- Tab: Proyectos -->
        <div v-if="courseTab === 'projects'">
          <div class="flex justify-between items-center mb-6">
            <h2 class="font-title text-2xl text-stone-800 uppercase">Constructor de Proyectos</h2>
            <button @click="openBuilderModal('projects', null, { course_id: builderCourse.id, order: builderData.projects?.length || 0 })" class="bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded-lg shadow-md uppercase text-sm">
              + Añadir Proyecto
            </button>
          </div>

          <div v-if="!builderData.projects || builderData.projects.length === 0" class="bg-white rounded-2xl p-12 text-center border border-stone-200">
            <p class="text-stone-400 mb-4">Este curso no tiene proyectos aún.</p>
            <button @click="openBuilderModal('projects', null, { course_id: builderCourse.id, order: 0 })" class="text-rose-500 font-bold uppercase text-sm hover:underline">Añadir tu primer proyecto</button>
          </div>

          <draggable 
            v-model="builderData.projects" 
            item-key="id" 
            handle=".drag-handle-project" 
            class="space-y-6"
            @end="saveProjectOrder"
          >
            <template #item="{ element: project, index }">
              <div class="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                <div class="bg-stone-50 p-4 border-b border-stone-200 flex justify-between items-center">
                  <div class="flex items-center gap-3">
                    <button class="drag-handle-project text-stone-300 hover:text-stone-600 cursor-grab text-xl leading-none">≡</button>
                    <span class="text-stone-400 font-mono text-sm border border-stone-300 rounded px-2">{{ index + 1 }}</span>
                    <h3 class="font-title text-xl text-stone-800 uppercase">{{ project.title }}</h3>
                  </div>
                  <div class="flex gap-3 items-center">
                    <button @click="openBuilderModal('projects', project)" class="text-stone-400 hover:text-rose-500 text-sm font-bold uppercase">Editar</button>
                    <div class="h-4 w-px bg-stone-300"></div>
                    <button @click="openBuilderModal('tasks', null, { project_id: project.id, order: project.tasks?.length || 0 })" class="text-stone-600 hover:text-stone-900 text-sm font-bold uppercase">+ Tarea</button>
                  </div>
                </div>

                <!-- Tasks -->
                <div class="p-4">
                  <draggable 
                    v-model="project.tasks" 
                    item-key="id" 
                    handle=".drag-handle-task"
                    @end="saveTaskOrder(project)"
                    class="space-y-3"
                  >
                    <template #item="{ element: task, index: tIndex }">
                      <div class="border border-stone-100 rounded-xl p-3 flex justify-between items-center hover:border-stone-300 transition-colors bg-white group">
                        <div class="flex items-center gap-3">
                          <button class="drag-handle-task text-stone-300 hover:text-stone-600 cursor-grab text-xl leading-none">≡</button>
                          <span class="text-stone-300 font-mono text-xs">{{ tIndex + 1 }}</span>
                          <span class="text-stone-700 font-bold">{{ task.title }}</span>
                        </div>
                        <div class="flex items-center gap-4">
                          <button @click="openBuilderModal('tasks', task)" class="text-stone-400 hover:text-stone-700 text-xs font-bold uppercase">Editar</button>
                        </div>
                      </div>
                    </template>
                  </draggable>
                  <p v-if="!project.tasks || project.tasks.length === 0" class="text-sm text-stone-400 pl-8 italic mt-3">Sin tareas en este proyecto.</p>
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </div>

      <!-- LESSON EDITOR -->
      <div v-else-if="activeView === 'lessonEditor'">
        <div class="flex justify-between items-center mb-8">
          <div class="flex items-center gap-6">
            <button @click="activeView = 'courseManager'" class="text-stone-400 hover:text-rose-500 font-bold uppercase text-xs tracking-wider flex items-center gap-1">
              <Icon name="arrow_back" size="16" /> Volver al Curso
            </button>
            <h1 class="font-title text-4xl text-stone-900 uppercase">{{ editingRecord ? 'Editar Lección' : 'Nueva Lección' }}</h1>
          </div>
          <button @click="saveLessonFromPage" :disabled="saving" class="bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 rounded-xl shadow-md uppercase text-sm tracking-wide disabled:opacity-50">
            {{ saving ? 'Guardando...' : 'Guardar Lección' }}
          </button>
        </div>
        
        <div class="bg-white rounded-3xl p-8 shadow-sm border border-stone-200 space-y-6 flex flex-col min-h-[70vh]">
          <div v-if="modalError" class="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-200">
            {{ modalError }}
          </div>
          
          <div v-for="field in activeFormConfig.fields.filter(f => !f.hidden)" :key="field.name" class="flex flex-col gap-2" :class="field.type === 'tiptap' ? 'flex-1 flex-col flex' : ''">
            <label class="font-bold text-stone-700 uppercase tracking-wide text-xs">{{ field.name }}</label>
            <p v-if="field.desc" class="text-stone-400 text-xs mb-2">{{ field.desc }}</p>
            
            <input v-if="field.type === 'text' || field.type === 'url' || field.type === 'email'" v-model="formData[field.name]" :type="field.type" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-rose-400 font-bold">
            
            <select v-else-if="field.type === 'select'" v-model="formData[field.name]" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-rose-400">
              <option v-for="opt in field.options" :key="opt" :value="opt">{{ opt }}</option>
            </select>
            
            <TiptapEditor v-else-if="field.type === 'tiptap'" v-model="formData[field.name]" class="flex-1 min-h-[500px]" />

            <textarea v-else-if="field.type === 'json' || field.type === 'text_long'" v-model="formData[field.name]" rows="5" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-rose-400 font-mono text-sm"></textarea>
            
            <input v-else-if="field.type === 'number'" v-model.number="formData[field.name]" type="number" step="0.01" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-rose-400">
            
            <div v-else-if="field.type === 'boolean'" class="flex items-center gap-3 bg-stone-50 p-4 border border-stone-200 rounded-xl">
              <input type="checkbox" v-model="formData[field.name]" class="w-5 h-5 accent-rose-500">
              <span class="text-sm font-medium text-stone-600">Activar {{ field.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- GENERIC DATA TABLE -->
      <div v-else-if="activeView === 'collection' && activeCol">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="font-title text-4xl text-stone-900 uppercase">{{ activeCol.name }}</h1>
            <p class="text-stone-500 mt-1">Administrando registros de {{ activeCol.id }}</p>
          </div>
          <button @click="openModal()" class="bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all uppercase text-sm tracking-wide flex items-center gap-2">
            <span>+</span> Nuevo Registro
          </button>
        </div>

        <!-- Table -->
        <div class="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-stone-50 border-b border-stone-200 text-stone-500 text-xs uppercase tracking-wider">
                  <th v-for="field in activeCol.fields.filter(f => !f.hidden)" :key="field.name" class="p-4 font-bold">{{ field.name }}</th>
                  <th class="p-4 font-bold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="loading" class="border-b border-stone-100">
                  <td :colspan="activeCol.fields.filter(f => !f.hidden).length + 1" class="p-8 text-center text-stone-400">Cargando datos...</td>
                </tr>
                <tr v-else-if="records.length === 0" class="border-b border-stone-100">
                  <td :colspan="activeCol.fields.filter(f => !f.hidden).length + 1" class="p-8 text-center text-stone-400">No hay registros aún.</td>
                </tr>
                <tr v-else v-for="record in records" :key="record.id" class="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                  <td v-for="field in activeCol.fields.filter(f => !f.hidden)" :key="field.name" class="p-4 text-sm text-stone-700 max-w-xs truncate">
                    {{ renderField(record, field) }}
                  </td>
                  <td class="p-4 text-right flex justify-end gap-3 items-center">
                    <button v-if="activeCol.id === 'courses'" @click="openCourseManager(record)" class="text-white bg-stone-900 hover:bg-black px-3 py-1 rounded text-xs font-bold uppercase">Builder</button>
                    <button @click="openModal(record)" class="text-rose-500 hover:text-rose-700 font-bold text-sm uppercase">Editar</button>
                    <button @click="deleteRecord(record.id)" class="text-stone-400 hover:text-red-600 font-bold text-sm uppercase">Eliminar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
    </main>

    <!-- Modal Formulario -->
    <div v-if="showModal" class="fixed inset-0 bg-stone-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <div class="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
          <h3 class="font-title text-2xl text-stone-900 uppercase">
            {{ editingRecord ? 'Editar' : 'Crear' }} 
            {{ activeFormConfig.id === 'lessons' ? (formData.contentType === 'quiz' ? 'Quiz' : 'Lección') : activeFormConfig.name }}
          </h3>
          <button @click="showModal = false" class="text-stone-400 hover:text-stone-700 text-2xl font-bold">&times;</button>
        </div>
        
        <div class="p-6 overflow-y-auto flex-1">
          <div v-if="modalError" class="bg-red-100 text-red-700 p-4 rounded-xl text-sm mb-6">{{ modalError }}</div>
          
          <form @submit.prevent="saveRecord" class="space-y-6">
            <div v-for="field in activeFormConfig.fields.filter(f => !f.hidden)" :key="field.name">
              
                  <label class="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-wide">{{ field.name }}</label>
                  
                  <select v-if="field.type === 'boolean'" v-model="formData[field.name]" class="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-rose-400">
                    <option :value="true">Sí (True)</option>
                    <option :value="false">No (False)</option>
                  </select>
                  
                  <select v-else-if="field.type === 'select'" v-model="formData[field.name]" class="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-rose-400">
                    <option v-for="opt in field.options" :key="opt" :value="opt">{{ opt }}</option>
                  </select>
                  
                  <select v-else-if="field.type === 'relation'" v-model="formData[field.name]" class="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-rose-400">
                    <option value="">Selecciona una opción</option>
                    <option v-for="opt in relationsData[field.collection]" :key="opt.id" :value="opt.id">
                      {{ opt[field.display] || opt.id }}
                    </option>
                  </select>
                  
                  <TiptapEditor v-else-if="field.type === 'tiptap'" v-model="formData[field.name]" />

                  <textarea v-else-if="field.type === 'json' || field.type === 'text_long'" v-model="formData[field.name]" rows="5" class="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-rose-400 font-mono text-sm"></textarea>
                  
                  <input v-else-if="field.type === 'number'" v-model.number="formData[field.name]" type="number" step="0.01" class="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-rose-400">
                  
                  <input v-else v-model="formData[field.name]" type="text" class="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-rose-400">
                  
                  <p v-if="field.desc" class="text-xs text-stone-400 mt-1">{{ field.desc }}</p>
            </div>

            <div class="flex justify-between items-center mt-6" v-if="editingRecord">
                <button type="button" @click="deleteRecord(editingRecord.id, activeFormConfig.id); showModal=false" class="text-red-500 hover:text-red-700 text-sm font-bold uppercase underline">Borrar Registro</button>
            </div>
          </form>
        </div>
        
        <div class="p-6 border-t border-stone-100 flex justify-end gap-4 bg-stone-50">
          <button @click="showModal = false" class="px-6 py-3 rounded-xl font-bold text-stone-500 hover:text-stone-700 uppercase text-sm transition-colors">Cancelar</button>
          <button @click="saveRecord" :disabled="saving" class="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-wide shadow-md transition-colors disabled:opacity-50">
            {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { pb } from '../lib/pocketbase';
import draggable from 'vuedraggable';
import TiptapEditor from './TiptapEditor.vue';
import Icon from './Icon.vue';

const isLoggedIn = ref(false);
const email = ref('admin@joksan.dev');
const password = ref('1234567890');
const error = ref('');

const activeView = ref('dashboard');

const relationsData = reactive({
  courses: [],
  course_sections: [],
  lessons: [],
  users: []
});

const totalPurchases = ref(0);

const fetchDashboardStats = async () => {
  try {
    const p = await pb.collection('purchases').getList(1, 1);
    totalPurchases.value = p.totalItems;
  } catch(e){}
};

const fetchRelations = async () => {
  try {
    relationsData.courses = await pb.collection('courses').getFullList({ sort: 'title' });
    relationsData.course_sections = await pb.collection('course_sections').getFullList({ sort: 'order' });
    relationsData.lessons = await pb.collection('lessons').getFullList({ sort: 'order' });
    relationsData.users = await pb.collection('users').getFullList({ sort: 'email' });
  } catch(e) {
    console.error("Error fetching relations", e);
  }
};

const config = [
  { 
    id: 'courses', name: 'Cursos', 
    fields: [
      { name: 'title', type: 'text' },
      { name: 'slug', type: 'text' },
      { name: 'description', type: 'text_long' },
      { name: 'price', type: 'number' },
      { name: 'access_days', type: 'number', desc: 'Días de acceso (0 o vacío = sin límite de tiempo)' },
      { name: 'status', type: 'select', options: ['published', 'draft', 'archived'], desc: 'Estado del curso' }
    ] 
  },
  { 
    id: 'purchases', name: 'Pedidos', 
    fields: [
      { name: 'user_id', type: 'relation', collection: 'users', display: 'email' },
      { name: 'course_id', type: 'relation', collection: 'courses', display: 'title' },
      { name: 'amount', type: 'number' },
      { name: 'status', type: 'text' }
    ] 
  },
  {
    id: 'blog', name: 'Blog',
    fields: [
      { name: 'title', type: 'text' },
      { name: 'slug', type: 'text' },
      { name: 'content', type: 'text_long' },
      { name: 'status', type: 'select', options: ['published', 'draft'] }
    ]
  },
  { 
    id: 'users', name: 'Usuarios', 
    fields: [
      { name: 'username', type: 'text' },
      { name: 'email', type: 'text' },
      { name: 'name', type: 'text' },
      { name: 'password', type: 'text', desc: 'Solo llenar si se desea cambiar la contraseña' }
    ] 
  },
  { 
    id: 'course_sections', name: 'Secciones', 
    fields: [
      { name: 'course_id', type: 'relation', collection: 'courses', display: 'title', hidden: true },
      { name: 'title', type: 'text' },
      { name: 'order', type: 'number', hidden: true }
    ] 
  },
  { 
    id: 'lessons', name: 'Lecciones', 
    fields: [
      { name: 'section_id', type: 'relation', collection: 'course_sections', display: 'title', hidden: true },
      { name: 'title', type: 'text' },
      { name: 'contentType', type: 'select', options: ['video', 'text', 'resource', 'quiz'] },
      { name: 'content', type: 'tiptap', desc: 'Contenido visual de la lección' },
      { name: 'order', type: 'number', hidden: true },
      { name: 'isFreePreview', type: 'boolean' }
    ] 
  },
  {
    id: 'projects', name: 'Proyectos',
    fields: [
      { name: 'course_id', type: 'relation', collection: 'courses', display: 'title', hidden: true },
      { name: 'title', type: 'text' },
      { name: 'description', type: 'text_long' },
      { name: 'order', type: 'number', hidden: true }
    ]
  },
  {
    id: 'tasks', name: 'Tareas',
    fields: [
      { name: 'project_id', type: 'relation', collection: 'projects', display: 'title', hidden: true },
      { name: 'title', type: 'text' },
      { name: 'description', type: 'text_long' },
      { name: 'order', type: 'number', hidden: true }
    ]
  },
  {
    id: 'student_projects', name: 'Entregas de Estudiantes',
    fields: [
      { name: 'user_id', type: 'relation', collection: 'users', display: 'email' },
      { name: 'project_id', type: 'relation', collection: 'projects', display: 'title' },
      { name: 'title', type: 'text' },
      { name: 'description', type: 'text_long' },
      { name: 'link', type: 'text' },
      { name: 'status', type: 'select', options: ['draft', 'submitted', 'graded'] }
    ]
  }
];

const activeCol = ref(null);
const records = ref([]);
const loading = ref(false);

const showModal = ref(false);
const editingRecord = ref(null);
const activeFormConfig = ref(null);
const formData = reactive({});
const saving = ref(false);
const modalError = ref('');

// BUILDER STATE
const builderCourse = ref(null);
const courseTab = ref('info');
const courseFormData = reactive({});
const builderData = reactive({ sections: [], projects: [] });

const openView = (viewName) => {
  activeView.value = viewName;
  builderCourse.value = null;
  activeCol.value = null;
  if(viewName === 'dashboard') fetchDashboardStats();
};

const openCourseManager = async (course) => {
  activeView.value = 'courseManager';
  builderCourse.value = course;
  courseTab.value = 'info';
  
  courseFormData.id = course.id;
  courseFormData.title = course.title;
  courseFormData.slug = course.slug;
  courseFormData.description = course.description;
  courseFormData.price = course.price;
  courseFormData.access_days = course.access_days || 0;
  courseFormData.status = course.status;

  await refreshBuilderData();
};

const saveCourseInfo = async () => {
  saving.value = true;
  try {
    const payload = { ...courseFormData };
    await pb.collection('courses').update(courseFormData.id, payload);
    builderCourse.value = { ...builderCourse.value, ...payload };
    
    const idx = records.value.findIndex(r => r.id === courseFormData.id);
    if (idx !== -1) {
      records.value[idx] = { ...records.value[idx], ...payload };
    }
    
    await fetchRelations();
    alert("¡Guardado correctamente!");
  } catch(e) {
    alert("Error guardando curso");
  } finally {
    saving.value = false;
  }
};

const refreshBuilderData = async () => {
  if (!builderCourse.value) return;
  try {
    const s = await pb.collection('course_sections').getFullList({ filter: `course_id="${builderCourse.value.id}"`, sort: 'order' });
    
    let l = [];
    if (s.length > 0) {
      const filterStr = s.map(sec => `section_id="${sec.id}"`).join(' || ');
      l = await pb.collection('lessons').getFullList({ filter: filterStr, sort: 'order' });
    }
    
    builderData.sections = s.map(sec => ({
      ...sec,
      lessons: l.filter(les => les.section_id === sec.id)
    }));

    const p = await pb.collection('projects').getFullList({ filter: `course_id="${builderCourse.value.id}"`, sort: 'order' });
    let t = [];
    if (p.length > 0) {
      const filterStr3 = p.map(proj => `project_id="${proj.id}"`).join(' || ');
      t = await pb.collection('tasks').getFullList({ filter: filterStr3, sort: 'order' });
    }
    
    builderData.projects = p.map(proj => ({
      ...proj,
      tasks: t.filter(tsk => tsk.project_id === proj.id)
    }));
    
  } catch(e) {
    console.error("Error al cargar constructor", e);
  }
};

const saveSectionOrder = async () => {
  for (let i = 0; i < builderData.sections.length; i++) {
    const section = builderData.sections[i];
    if (section.order !== i) {
      section.order = i;
      await pb.collection('course_sections').update(section.id, { order: i });
    }
  }
};

const saveLessonOrder = async (section) => {
  for (let i = 0; i < section.lessons.length; i++) {
    const lesson = section.lessons[i];
    if (lesson.order !== i) {
      lesson.order = i;
      await pb.collection('lessons').update(lesson.id, { order: i });
    }
  }
};

const saveProjectOrder = async () => {
  if(!builderData.projects) return;
  for (let i = 0; i < builderData.projects.length; i++) {
    const project = builderData.projects[i];
    if (project.order !== i) {
      project.order = i;
      await pb.collection('projects').update(project.id, { order: i });
    }
  }
};

const saveTaskOrder = async (project) => {
  if(!project.tasks) return;
  for (let i = 0; i < project.tasks.length; i++) {
    const task = project.tasks[i];
    if (task.order !== i) {
      task.order = i;
      await pb.collection('tasks').update(task.id, { order: i });
    }
  }
};

onMounted(() => {
  if (pb.authStore.isValid && (pb.authStore.isAdmin || pb.authStore.isSuperuser || pb.authStore.record?.email === 'admin@joksan.dev')) {
    isLoggedIn.value = true;
    fetchRelations();
    openView('dashboard');
  }
});

const login = async () => {
  error.value = '';
  try {
    const result = await pb.send('/api/admins/auth-with-password', {
      method: 'POST',
      body: { identity: email.value, password: password.value }
    });
    pb.authStore.save(result.token, result.admin);
    
    isLoggedIn.value = true;
    fetchRelations();
    openView('dashboard');
  } catch(e) {
    error.value = 'Credenciales inválidas.';
  }
};

const logout = () => {
  pb.authStore.clear();
  isLoggedIn.value = false;
};

const openCollection = async (colId) => {
  activeView.value = 'collection';
  activeCol.value = config.find(c => c.id === colId);
  await fetchRecords();
};

const fetchRecords = async () => {
  if (!activeCol.value) return;
  loading.value = true;
  try {
    records.value = await pb.collection(activeCol.value.id).getFullList({ sort: '-created' });
  } catch(e) {
    console.error(e);
    alert('Error cargando los datos.');
  } finally {
    loading.value = false;
  }
};

const renderField = (record, field) => {
  const val = record[field.name];
  if (val === undefined || val === null) return '-';
  if (field.type === 'json' && typeof val === 'object') return JSON.stringify(val).substring(0, 50) + '...';
  if (field.type === 'boolean') return val ? 'Sí' : 'No';
  if (field.type === 'relation') {
    const relArray = relationsData[field.collection];
    if (relArray) {
      const relObj = relArray.find(r => r.id === val);
      if (relObj) return relObj[field.display] || val;
    }
  }
  return String(val).substring(0, 50);
};

const openModal = (record = null) => {
  openBuilderModal(activeCol.value.id, record);
};

const openBuilderModal = (collectionId, record = null, defaults = {}) => {
  modalError.value = '';
  activeFormConfig.value = config.find(c => c.id === collectionId);
  editingRecord.value = record;
  
  for (const key in formData) delete formData[key];
  
  if (record) {
    activeFormConfig.value.fields.forEach(f => {
      let val = record[f.name];
      if (f.type === 'json' && typeof val === 'object') {
        val = JSON.stringify(val, null, 2);
      }
      if (f.type === 'tiptap' && val && typeof val === 'object' && val.html) {
        val = val.html;
      }
      formData[f.name] = val;
    });
  } else {
    activeFormConfig.value.fields.forEach(f => {
      formData[f.name] = defaults[f.name] !== undefined ? defaults[f.name] : (f.type === 'boolean' ? false : (f.type === 'number' ? 0 : ''));
    });
  }
  
  if (collectionId === 'lessons') {
    activeView.value = 'lessonEditor';
  } else {
    showModal.value = true;
  }
};

const saveLessonFromPage = async () => {
  await saveRecord();
  if (!modalError.value) {
    activeView.value = 'courseManager';
    await refreshBuilderData();
  }
};

watch(() => formData.title, (newVal) => {
  if (activeFormConfig.value?.id === 'courses' && newVal) {
    if (!editingRecord.value || !formData.slug) {
      formData.slug = newVal.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
  }
});
watch(() => courseFormData.title, (newVal) => {
  if (newVal) {
    if (!courseFormData.slug || courseFormData.slug === builderCourse.value.slug) {
      courseFormData.slug = newVal.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
  }
});

const saveRecord = async () => {
  modalError.value = '';
  saving.value = true;
  
  try {
    const payload = { ...formData };
    
    activeFormConfig.value.fields.forEach(f => {
      if (f.type === 'json' && payload[f.name]) {
        try {
          payload[f.name] = JSON.parse(payload[f.name]);
        } catch(e) {
          throw new Error(`El campo ${f.name} no tiene un formato JSON válido.`);
        }
      }
      if (f.type === 'tiptap' && payload[f.name]) {
        payload[f.name] = { html: payload[f.name] };
      }
      if (f.name === 'password' && !payload[f.name]) {
        delete payload.password;
      }
    });

    // Normal saving
    if (editingRecord.value) {
      if (activeFormConfig.value.id === 'users' && payload.password) payload.passwordConfirm = payload.password;
      await pb.collection(activeFormConfig.value.id).update(editingRecord.value.id, payload);
    } else {
      if (activeFormConfig.value.id === 'users') payload.passwordConfirm = payload.password;
      await pb.collection(activeFormConfig.value.id).create(payload);
    }
    
    if (activeView.value !== 'lessonEditor') {
      showModal.value = false;
    }
    
    if (activeView.value === 'courseManager' || activeView.value === 'lessonEditor') {
      await refreshBuilderData();
    } else {
      await fetchRecords();
      await fetchRelations();
    }
  } catch(e) {
    console.error(e);
    modalError.value = e.message || 'Error al guardar los datos. Revisa los campos.';
  } finally {
    saving.value = false;
  }
};

const deleteRecord = async (id, overrideCollectionId = null) => {
  if (confirm('¿Estás seguro de que deseas eliminar este registro de forma permanente?')) {
    try {
      const colId = overrideCollectionId || activeCol.value.id;
      
      // If deleting a quiz, we should technically delete its evaluation too (cascade)
      if (colId === 'lessons') {
         const evals = await pb.collection('evaluations').getFullList({ filter: `lesson_id="${id}"`});
         for(let e of evals) await pb.collection('evaluations').delete(e.id);
      }

      await pb.collection(colId).delete(id);
      
      if (activeView.value === 'courseManager') {
        await refreshBuilderData();
      } else {
        await fetchRecords();
        await fetchRelations();
      }
    } catch(e) {
      alert('Error eliminando el registro.');
    }
  }
};
</script>
