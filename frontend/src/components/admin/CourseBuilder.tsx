import React, { useEffect, useState } from "react"
import { pb } from "@/lib/pocketbase"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "../ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { TiptapReact } from "./TiptapReact"
import { QuizBuilder } from "./QuizBuilder"

interface CourseBuilderProps {
  courseId: string
}

export function CourseBuilder({ courseId }: CourseBuilderProps) {
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Builder data
  const [sections, setSections] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'info' | 'content' | 'config' | 'students' | 'tasks_submissions' | 'projects_submissions'>('info')
  const [students, setStudents] = useState<any[]>([])
  const [taskSubmissions, setTaskSubmissions] = useState<any[]>([])
  const [projectSubmissions, setProjectSubmissions] = useState<any[]>([])

  // Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<string>('')
  const [modalData, setModalData] = useState<any>({})

  const [editorMode, setEditorMode] = useState<'lesson' | 'quiz' | 'task' | 'project' | null>(null)
  const [activeItemData, setActiveItemData] = useState<any>({})

  const loadData = async () => {
    try {
      if (courseId === 'new') {
        setCourse({
          title: '', slug: '', description: '', status: 'draft',
          meta_title: '', meta_description: '', price: 0, discount_price: 0
        })
      } else {
        const c = await pb.collection('courses').getOne(courseId)
        setCourse(c)

        // Load Sections
        const s = await pb.collection('course_sections').getFullList({ filter: `course_id="${c.id}"`, sort: 'order' })

        // Load lessons, quizzes, tasks for these sections
        let l: any[] = [], q: any[] = [], t: any[] = []
        if (s.length > 0) {
          const filterStr = s.map(sec => `section_id="${sec.id}"`).join(' || ')
          l = await pb.collection('lessons').getFullList({ filter: filterStr, sort: 'order' })
          q = await pb.collection('quizzes').getFullList({ filter: filterStr, sort: 'order' })
          t = await pb.collection('tasks').getFullList({ filter: filterStr, sort: 'order' })
        }

        setSections(s.map(sec => ({
          ...sec,
          items: [
            ...l.filter(les => les.section_id === sec.id).map(les => ({ ...les, _type: 'lesson' })),
            ...q.filter(qu => qu.section_id === sec.id).map(qu => ({ ...qu, _type: 'quiz' })),
            ...t.filter(tk => tk.section_id === sec.id).map(tk => ({ ...tk, _type: 'task' }))
          ].sort((a, b) => (a.order || 0) - (b.order || 0))
        })))

        // Load Projects
        const p = await pb.collection('projects').getFullList({ filter: `course_id="${c.id}"`, sort: 'order' })
        setProjects(p)

        // Load Students (Purchases)
        try {
          const pur = await pb.collection('purchases').getFullList({ filter: `course_id="${c.id}"`, expand: 'user_id' })
          setStudents(pur.map((purchase: any) => purchase.expand?.user_id).filter(Boolean))
        } catch (e) { console.error("Error loading purchases", e) }

        // Load project submissions
        if (p.length > 0) {
          try {
            const filterStr = p.map((x:any) => `project_id="${x.id}"`).join(' || ')
            const pSubs = await pb.collection('project_submissions').getFullList({ filter: filterStr, expand: 'user_id,project_id' })
            setProjectSubmissions(pSubs)
          } catch(e) { console.error("Error loading student_projects", e) }
        }

        // Load task submissions
        if (t.length > 0) {
          try {
            const filterStr = t.map((x:any) => `task_id="${x.id}"`).join(' || ')
            const tSubs = await pb.collection('task_submissions').getFullList({ filter: filterStr, expand: 'user_id,task_id' })
            setTaskSubmissions(tSubs)
          } catch(e) { console.error("Error loading student_tasks", e) }
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [courseId])

  const saveCourse = async () => {
    setSaving(true)
    try {
      if (courseId === 'new') {
        const res = await pb.collection('courses').create(course)
        window.location.href = `/admin/cursos/${res.id}`
      } else {
        await pb.collection('courses').update(course.id, course)
        alert('Curso guardado correctamente.')
      }
    } catch (e) {
      console.error(e)
      alert('Error al guardar el curso.')
    } finally {
      setSaving(false)
    }
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setCourse({ ...course, title, slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') })
  }

  const openModal = (type: string, defaults: any = {}, record: any = null) => {
    setModalType(type)
    setModalData(record || defaults)
    setModalOpen(true)
  }

  const saveModal = async () => {
    setSaving(true)
    try {
      if (modalData.id) {
        await pb.collection(modalType).update(modalData.id, modalData)
      } else {
        await pb.collection(modalType).create(modalData)
      }
      setModalOpen(false)
      loadData()
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const deleteModal = async () => {
    if (confirm('¿Seguro que deseas eliminar este elemento?')) {
      await pb.collection(modalType).delete(modalData.id)
      setModalOpen(false)
      loadData()
    }
  }

  const approveSubmission = async (sub: any, type: 'task' | 'project') => {
    setSaving(true);
    try {
      await pb.collection(type === 'task' ? 'task_submissions' : 'project_submissions').update(sub.id, { status: 'graded' });
      
      const payload: any = { user_id: sub.user_id, isCompleted: true };
      if (type === 'task') payload.task_id = sub.task_id;
      if (type === 'project') payload.project_id = sub.project_id;
      
      // Intentar crear el user_progress si no existe
      try {
        await pb.collection('user_progress').create(payload);
      } catch (e) {
        console.error("Ya existe progreso para este usuario y recurso", e);
      }
      
      loadData();
    } catch(e) {
      console.error(e);
      alert('Error al aprobar entrega');
    } finally {
      setSaving(false);
    }
  }

  const saveActiveItem = async () => {
    setSaving(true)
    try {
      const payload = { ...activeItemData }
      if (editorMode === 'lesson') {
        if (payload.content && typeof payload.content === 'string') {
          payload.content = { html: payload.content }
        }
      }
      
      const coll = editorMode === 'lesson' ? 'lessons' : editorMode === 'quiz' ? 'quizzes' : editorMode === 'task' ? 'tasks' : 'projects'

      if (activeItemData.id) {
        await pb.collection(coll).update(activeItemData.id, payload)
      } else {
        await pb.collection(coll).create(payload)
      }
      setEditorMode(null)
      loadData()
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const deleteActiveItem = async () => {
    if (confirm('¿Seguro que deseas eliminar este elemento?')) {
      const coll = editorMode === 'lesson' ? 'lessons' : editorMode === 'quiz' ? 'quizzes' : editorMode === 'task' ? 'tasks' : 'projects'
      await pb.collection(coll).delete(activeItemData.id)
      setEditorMode(null)
      loadData()
    }
  }

  const uploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const formData = new FormData()
      formData.append('cover', e.target.files[0])
      try {
        const updated = await pb.collection('courses').update(course.id, formData)
        setCourse(updated)
      } catch (err) {
        console.error(err)
      }
    }
  }

  if (loading) return <div className="p-8">Cargando constructor...</div>
  if (!course) return <div className="p-8">Curso no encontrado</div>



  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-20 mt-6 px-4">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{editorMode ? (activeItemData.id ? `Editar ${editorMode}` : `Nuevo ${editorMode}`) : (courseId === 'new' ? 'Nuevo Curso' : 'Editor de Curso')}</h1>
          <p className="text-muted-foreground">{course.title || 'Sin título'}</p>
        </div>
        {editorMode ? (
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => setEditorMode(null)}>Cancelar</Button>
            <Button onClick={saveActiveItem} disabled={saving}>
              <span className="material-symbols-outlined mr-2 text-[18px]">save</span>
              {saving ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        ) : (
          <Button onClick={saveCourse} disabled={saving}>
            <span className="material-symbols-outlined mr-2 text-[18px]">save</span>
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="col-span-1 space-y-2">
          <nav className="flex flex-col gap-1">
            <Button variant={activeTab === 'info' && !editorMode ? 'secondary' : 'ghost'} className="justify-start w-full font-bold" onClick={() => { setActiveTab('info'); setEditorMode(null); }}>
              <span className="material-symbols-outlined mr-2 text-[18px]">info</span> Información
            </Button>
            <Button variant={activeTab === 'content' || editorMode ? 'secondary' : 'ghost'} className="justify-start w-full font-bold" disabled={courseId === 'new'} onClick={() => { setActiveTab('content'); setEditorMode(null); }}>
              <span className="material-symbols-outlined mr-2 text-[18px]">menu_book</span> Contenido
            </Button>
            <Button variant={activeTab === 'config' && !editorMode ? 'secondary' : 'ghost'} className="justify-start w-full font-bold" disabled={courseId === 'new'} onClick={() => { setActiveTab('config'); setEditorMode(null); }}>
              <span className="material-symbols-outlined mr-2 text-[18px]">settings</span> Configuración
            </Button>
            
            <div className="pt-4 pb-1">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-4">Gestión</span>
            </div>
            <Button variant={activeTab === 'students' && !editorMode ? 'secondary' : 'ghost'} className="justify-start w-full font-bold" disabled={courseId === 'new'} onClick={() => { setActiveTab('students'); setEditorMode(null); }}>
              <span className="material-symbols-outlined mr-2 text-[18px]">group</span> Estudiantes
            </Button>
            <Button variant={activeTab === 'tasks_submissions' && !editorMode ? 'secondary' : 'ghost'} className="justify-start w-full font-bold" disabled={courseId === 'new'} onClick={() => { setActiveTab('tasks_submissions'); setEditorMode(null); }}>
              <span className="material-symbols-outlined mr-2 text-[18px]">assignment</span> Entregas Tareas
            </Button>
            <Button variant={activeTab === 'projects_submissions' && !editorMode ? 'secondary' : 'ghost'} className="justify-start w-full font-bold" disabled={courseId === 'new'} onClick={() => { setActiveTab('projects_submissions'); setEditorMode(null); }}>
              <span className="material-symbols-outlined mr-2 text-[18px]">work</span> Entregas Proyectos
            </Button>
          </nav>
        </aside>

        <main className="col-span-1 md:col-span-3 space-y-6">
          {editorMode ? (
            <Card>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input value={activeItemData.title || ''} onChange={e => setActiveItemData({ ...activeItemData, title: e.target.value })} />
                </div>
                
                {editorMode === 'lesson' && (
                  <>
                    <div className="space-y-2">
                      <Label>Tipo de Contenido</Label>
                      <Select value={activeItemData.contentType || 'text'} onValueChange={v => setActiveItemData({ ...activeItemData, contentType: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Texto</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="resource">Recurso / Descargable</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Contenido</Label>
                      <TiptapReact value={activeItemData.content?.html || activeItemData.content || ''} onChange={v => setActiveItemData({ ...activeItemData, content: v })} />
                    </div>
                  </>
                )}

                {(editorMode === 'task' || editorMode === 'project') && (
                  <div className="space-y-2">
                    <Label>Descripción / Instrucciones</Label>
                    <TiptapReact value={activeItemData.description?.html || activeItemData.description || ''} onChange={v => setActiveItemData({ ...activeItemData, description: v })} />
                  </div>
                )}

                {editorMode === 'quiz' && (
                  <div className="space-y-2">
                    <Label>Preguntas</Label>
                    <div className="border rounded-md p-4 bg-muted/10">
                      <QuizBuilder
                        questions={typeof activeItemData.questions === 'object' ? activeItemData.questions : []}
                        onChange={q => setActiveItemData({ ...activeItemData, questions: q })}
                      />
                    </div>
                  </div>
                )}

                {activeItemData.id && (
                  <div className="pt-4 flex justify-end">
                    <Button variant="destructive" onClick={deleteActiveItem}>Eliminar {editorMode}</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
          {activeTab === 'info' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información Básica</CardTitle>
                  <CardDescription>Los detalles principales que identifican al curso.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Título del Curso</Label>
                      <Input value={course.title} onChange={handleTitleChange} placeholder="Ej. Curso de Next.js" />
                    </div>
                    <div className="space-y-2">
                      <Label>Slug (URL)</Label>
                      <Input value={course.slug} onChange={e => setCourse({ ...course, slug: e.target.value })} placeholder="curso-de-next-js" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Descripción Corta</Label>
                    <Textarea value={course.description} onChange={e => setCourse({ ...course, description: e.target.value })} rows={4} />
                  </div>
                  <div className="space-y-2">
                    <Label>Estado de Publicación</Label>
                    <Select value={course.status} onValueChange={v => setCourse({ ...course, status: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Borrador</SelectItem>
                        <SelectItem value="published">Publicado</SelectItem>
                        <SelectItem value="archived">Archivado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {courseId !== 'new' && (
                    <div className="space-y-2">
                      <Label>Portada del Curso</Label>
                      <div className="flex items-center gap-4">
                        {course.cover && <img src={pb.files.getURL(course, course.cover, { thumb: '100x100' })} alt="Cover" className="h-16 rounded object-cover" />}
                        <Input type="file" accept="image/*" onChange={uploadCover} />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">Estructura del Curso</h2>
                  <p className="text-sm text-muted-foreground">Organiza el temario en secciones, lecciones, quizzes y tareas.</p>
                </div>
                <Button onClick={() => openModal('course_sections', { course_id: course.id, order: sections.length })}>
                  <span className="material-symbols-outlined mr-2">add</span> Sección
                </Button>
              </div>

              <div className="space-y-6">
                {sections.length === 0 && (
                  <div className="text-center p-8 border rounded-lg bg-muted/50 text-muted-foreground">No hay secciones creadas. Añade la primera para empezar a subir contenido.</div>
                )}
                {sections.map((sec, sIdx) => (
                  <Card key={sec.id} className="overflow-hidden">
                    <div className="bg-muted px-4 py-3 border-b flex justify-between items-center">
                      <div className="font-bold flex items-center gap-2">
                        <span className="text-muted-foreground font-mono text-xs">{sIdx + 1}</span>
                        {sec.title}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openModal('course_sections', {}, sec)}>Editar</Button>
                        <div className="w-px h-4 bg-border"></div>
                        <Button variant="ghost" size="sm" onClick={() => { setActiveItemData({ section_id: sec.id, order: sec.items.length, contentType: 'text' }); setEditorMode('lesson') }} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">+ Lección</Button>
                        <Button variant="ghost" size="sm" onClick={() => { setActiveItemData({ section_id: sec.id, order: sec.items.length }); setEditorMode('quiz') }} className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">+ Quiz</Button>
                        <Button variant="ghost" size="sm" onClick={() => { setActiveItemData({ section_id: sec.id, order: sec.items.length }); setEditorMode('task') }} className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">+ Tarea</Button>
                      </div>
                    </div>
                    <CardContent className="p-0">
                      {sec.items.length === 0 ? (
                        <div className="text-center p-4 text-sm text-muted-foreground italic">Sección vacía.</div>
                      ) : (
                        <div className="divide-y">
                          {sec.items.map((item: any, iIdx: number) => (
                            <div key={item.id} className="p-3 px-4 flex justify-between items-center hover:bg-muted/50 transition-colors group">
                              <div className="flex items-center gap-3">
                                <span className="text-muted-foreground font-mono text-xs w-4">{iIdx + 1}</span>
                                <Badge variant={item._type === 'quiz' ? 'secondary' : item._type === 'task' ? 'outline' : 'default'} className="uppercase text-[10px] w-16 justify-center">
                                  {item._type === 'lesson' ? (item.contentType || 'text') : item._type}
                                </Badge>
                                <span className="font-medium text-sm">{item.title}</span>
                              </div>
                              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100" onClick={() => {
                                if (item._type === 'lesson') { setActiveItemData(item); setEditorMode('lesson') }
                                else if (item._type === 'quiz') { setActiveItemData(item); setEditorMode('quiz') }
                                else if (item._type === 'task') { setActiveItemData(item); setEditorMode('task') }
                              }}>Editar</Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-12">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-bold">Proyectos Integradores</h2>
                    <p className="text-sm text-muted-foreground">Proyectos finales independientes de las secciones.</p>
                  </div>
                  <Button onClick={() => { setActiveItemData({ course_id: course.id, order: projects.length }); setEditorMode('project') }}>
                    <span className="material-symbols-outlined mr-2">add</span> Proyecto
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {projects.length === 0 && <div className="text-center p-8 border rounded-lg bg-muted/50 text-muted-foreground">Sin proyectos integradores.</div>}
                  {projects.map(p => (
                    <Card key={p.id}>
                      <CardHeader className="flex flex-row justify-between items-center space-y-0 py-4">
                        <div>
                          <CardTitle className="text-base">{p.title}</CardTitle>
                          <CardDescription className="line-clamp-1 mt-1">{p.description}</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => { setActiveItemData(p); setEditorMode('project') }}>Editar</Button>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ventas y Precios</CardTitle>
                  <CardDescription>Configura cómo se venderá este curso. (0 = Gratis)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Precio General ($ USD)</Label>
                      <Input type="number" step="0.01" value={course.price ?? ''} onChange={e => setCourse({ ...course, price: e.target.value === '' ? 0 : parseFloat(e.target.value) })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Precio con Descuento ($ USD)</Label>
                      <Input type="number" step="0.01" value={course.discount_price ?? ''} onChange={e => setCourse({ ...course, discount_price: e.target.value === '' ? 0 : parseFloat(e.target.value) })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Inicio de Descuento</Label>
                      <Input type="datetime-local" value={course.discount_start ? course.discount_start.substring(0, 16) : ''} onChange={e => setCourse({ ...course, discount_start: new Date(e.target.value).toISOString() })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Fin de Descuento</Label>
                      <Input type="datetime-local" value={course.discount_end ? course.discount_end.substring(0, 16) : ''} onChange={e => setCourse({ ...course, discount_end: new Date(e.target.value).toISOString() })} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SEO y Metadatos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Meta Título</Label>
                    <Input value={course.meta_title || ''} onChange={e => setCourse({ ...course, meta_title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Meta Descripción</Label>
                    <Textarea value={course.meta_description || ''} onChange={e => setCourse({ ...course, meta_description: e.target.value })} rows={3} />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Estudiantes Matriculados</CardTitle>
                  <CardDescription>Usuarios que han comprado este curso o tienen acceso.</CardDescription>
                </CardHeader>
                <CardContent>
                  {students.length === 0 ? <p className="text-muted-foreground text-sm">No hay estudiantes matriculados aún.</p> : (
                    <div className="space-y-4">
                      {students.map((student: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-4 p-4 border rounded-lg bg-card">
                          <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 font-bold uppercase">
                            {student.name ? student.name[0] : student.username ? student.username[0] : 'U'}
                          </div>
                          <div>
                            <p className="font-bold">{student.name || student.username || 'Sin nombre'}</p>
                            <p className="text-sm text-muted-foreground">{student.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'tasks_submissions' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Entregas de Tareas</CardTitle>
                  <CardDescription>Revisa el trabajo enviado por tus estudiantes.</CardDescription>
                </CardHeader>
                <CardContent>
                  {taskSubmissions.length === 0 ? <p className="text-muted-foreground text-sm">No hay tareas entregadas aún.</p> : (
                    <div className="space-y-4">
                      {taskSubmissions.map((sub: any) => (
                        <div key={sub.id} className="p-4 border rounded-lg bg-card space-y-2">
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold">{sub.expand?.task_id?.title || 'Tarea'}</h3>
                            <Badge variant={sub.status === 'submitted' ? 'default' : 'secondary'}>{sub.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Estudiante: {sub.expand?.user_id?.name || sub.expand?.user_id?.email}</p>
                          {sub.link && <a href={sub.link} target="_blank" className="text-blue-600 hover:underline text-sm font-medium block">🔗 Ver enlace adjunto</a>}
                          {sub.description && <div className="text-sm bg-muted/50 p-3 rounded-md mt-2 whitespace-pre-wrap">{sub.description}</div>}
                          {sub.status === 'submitted' && (
                            <div className="pt-2">
                              <Button size="sm" onClick={() => approveSubmission(sub, 'task')} disabled={saving} className="bg-green-600 hover:bg-green-700">✓ Aprobar Tarea</Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'projects_submissions' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Entregas de Proyectos Integradores</CardTitle>
                  <CardDescription>Revisa los proyectos finales enviados.</CardDescription>
                </CardHeader>
                <CardContent>
                  {projectSubmissions.length === 0 ? <p className="text-muted-foreground text-sm">No hay proyectos entregados aún.</p> : (
                    <div className="space-y-4">
                      {projectSubmissions.map((sub: any) => (
                        <div key={sub.id} className="p-4 border rounded-lg bg-card space-y-2">
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold">{sub.expand?.project_id?.title || 'Proyecto'}</h3>
                            <Badge variant={sub.status === 'submitted' ? 'default' : 'secondary'}>{sub.status}</Badge>
                          </div>
                          <p className="text-sm font-bold text-rose-700">{sub.title}</p>
                          <p className="text-sm text-muted-foreground">Estudiante: {sub.expand?.user_id?.name || sub.expand?.user_id?.email}</p>
                          {sub.link && <a href={sub.link} target="_blank" className="text-blue-600 hover:underline text-sm font-medium block">🔗 Ver Proyecto Final</a>}
                          {sub.description && <div className="text-sm bg-muted/50 p-3 rounded-md mt-2 whitespace-pre-wrap">{sub.description}</div>}
                          {sub.status === 'submitted' && (
                            <div className="pt-2">
                              <Button size="sm" onClick={() => approveSubmission(sub, 'project')} disabled={saving} className="bg-green-600 hover:bg-green-700">✓ Aprobar Proyecto</Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
            </>
          )}
        </main>
      </div>

      {/* GENERIC MODAL PARA SECCIONES */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="uppercase">{modalData.id ? 'Editar' : 'Crear'} Sección</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input value={modalData.title || ''} onChange={e => setModalData({ ...modalData, title: e.target.value })} />
            </div>
          </div>
          <DialogFooter className="flex justify-between items-center">
            {modalData.id ? (
              <Button type="button" variant="destructive" onClick={deleteModal}>Eliminar</Button>
            ) : <div />}
            <Button onClick={saveModal} disabled={saving}>{saving ? 'Guardando...' : 'Guardar Cambios'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
