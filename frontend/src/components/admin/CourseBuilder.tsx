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

  // Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<string>('')
  const [modalData, setModalData] = useState<any>({})

  const [lessonEditorOpen, setLessonEditorOpen] = useState(false)
  const [lessonData, setLessonData] = useState<any>({})

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
            ...l.filter(les => les.section_id === sec.id).map(les => ({...les, _type: 'lesson'})),
            ...q.filter(qu => qu.section_id === sec.id).map(qu => ({...qu, _type: 'quiz'})),
            ...t.filter(tk => tk.section_id === sec.id).map(tk => ({...tk, _type: 'task'}))
          ].sort((a, b) => (a.order || 0) - (b.order || 0))
        })))

        // Load Projects
        const p = await pb.collection('projects').getFullList({ filter: `course_id="${c.id}"`, sort: 'order' })
        setProjects(p)
      }
    } catch(e) {
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
    } catch(e) {
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
    } catch(e) {
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

  const saveLesson = async () => {
    setSaving(true)
    try {
      const payload = { ...lessonData }
      if (payload.content && typeof payload.content === 'string') {
        payload.content = { html: payload.content }
      }
      if (lessonData.id) {
        await pb.collection('lessons').update(lessonData.id, payload)
      } else {
        await pb.collection('lessons').create(payload)
      }
      setLessonEditorOpen(false)
      loadData()
    } catch(e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const deleteLesson = async () => {
    if (confirm('¿Seguro que deseas eliminar esta lección?')) {
      await pb.collection('lessons').delete(lessonData.id)
      setLessonEditorOpen(false)
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
      } catch(err) {
        console.error(err)
      }
    }
  }

  if (loading) return <div className="p-8">Cargando constructor...</div>
  if (!course) return <div className="p-8">Curso no encontrado</div>

  if (lessonEditorOpen) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" className="mb-2 -ml-4" onClick={() => setLessonEditorOpen(false)}>
              <span className="material-symbols-outlined mr-2">arrow_back</span> Volver
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">{lessonData.id ? 'Editar Lección' : 'Nueva Lección'}</h1>
          </div>
          <Button onClick={saveLesson} disabled={saving}>
            <span className="material-symbols-outlined mr-2 text-[18px]">save</span>
            {saving ? 'Guardando...' : 'Guardar Lección'}
          </Button>
        </div>
        
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input value={lessonData.title || ''} onChange={e => setLessonData({...lessonData, title: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Contenido</Label>
              <Select value={lessonData.contentType || 'text'} onValueChange={v => setLessonData({...lessonData, contentType: v})}>
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
              <TiptapReact value={lessonData.content?.html || lessonData.content || ''} onChange={v => setLessonData({...lessonData, content: v})} />
            </div>
            {lessonData.id && (
              <div className="pt-4 flex justify-end">
                <Button variant="destructive" onClick={deleteLesson}>Eliminar Lección</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{courseId === 'new' ? 'Nuevo Curso' : 'Editor de Curso'}</h1>
          <p className="text-muted-foreground">{course.title || 'Sin título'}</p>
        </div>
        <Button onClick={saveCourse} disabled={saving}>
          <span className="material-symbols-outlined mr-2 text-[18px]">save</span>
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="info">1. Información</TabsTrigger>
          <TabsTrigger value="content" disabled={courseId === 'new'}>2. Contenido</TabsTrigger>
          <TabsTrigger value="config" disabled={courseId === 'new'}>3. Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
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
                  <Input value={course.slug} onChange={e => setCourse({...course, slug: e.target.value})} placeholder="curso-de-next-js" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Descripción Corta</Label>
                <Textarea value={course.description} onChange={e => setCourse({...course, description: e.target.value})} rows={4} />
              </div>
              <div className="space-y-2">
                <Label>Estado de Publicación</Label>
                <Select value={course.status} onValueChange={v => setCourse({...course, status: v})}>
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
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
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
                    <Button variant="ghost" size="sm" onClick={() => { setLessonData({ section_id: sec.id, order: sec.items.length, contentType: 'text' }); setLessonEditorOpen(true) }} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">+ Lección</Button>
                    <Button variant="ghost" size="sm" onClick={() => openModal('quizzes', { section_id: sec.id, order: sec.items.length })} className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">+ Quiz</Button>
                    <Button variant="ghost" size="sm" onClick={() => openModal('tasks', { section_id: sec.id, order: sec.items.length })} className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">+ Tarea</Button>
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
                            if (item._type === 'lesson') { setLessonData(item); setLessonEditorOpen(true) }
                            else if (item._type === 'quiz') openModal('quizzes', {}, item)
                            else if (item._type === 'task') openModal('tasks', {}, item)
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
              <Button onClick={() => openModal('projects', { course_id: course.id, order: projects.length })}>
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
                    <Button variant="ghost" size="sm" onClick={() => openModal('projects', {}, p)}>Editar</Button>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ventas y Precios</CardTitle>
              <CardDescription>Configura cómo se venderá este curso. (0 = Gratis)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Precio General ($ USD)</Label>
                  <Input type="number" step="0.01" value={course.price || ''} onChange={e => setCourse({...course, price: parseFloat(e.target.value) || 0})} />
                </div>
                <div className="space-y-2">
                  <Label>Precio con Descuento ($ USD)</Label>
                  <Input type="number" step="0.01" value={course.discount_price || ''} onChange={e => setCourse({...course, discount_price: parseFloat(e.target.value) || 0})} />
                </div>
                <div className="space-y-2">
                  <Label>Inicio de Descuento</Label>
                  <Input type="datetime-local" value={course.discount_start ? course.discount_start.substring(0, 16) : ''} onChange={e => setCourse({...course, discount_start: new Date(e.target.value).toISOString()})} />
                </div>
                <div className="space-y-2">
                  <Label>Fin de Descuento</Label>
                  <Input type="datetime-local" value={course.discount_end ? course.discount_end.substring(0, 16) : ''} onChange={e => setCourse({...course, discount_end: new Date(e.target.value).toISOString()})} />
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
                <Input value={course.meta_title || ''} onChange={e => setCourse({...course, meta_title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Meta Descripción</Label>
                <Textarea value={course.meta_description || ''} onChange={e => setCourse({...course, meta_description: e.target.value})} rows={3} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* GENERIC MODAL */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="uppercase">{modalData.id ? 'Editar' : 'Crear'} {modalType === 'course_sections' ? 'Sección' : modalType === 'tasks' ? 'Tarea' : modalType === 'quizzes' ? 'Quiz' : 'Proyecto'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input value={modalData.title || ''} onChange={e => setModalData({...modalData, title: e.target.value})} />
            </div>
            {(modalType === 'projects' || modalType === 'tasks') && (
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Textarea value={modalData.description || ''} onChange={e => setModalData({...modalData, description: e.target.value})} rows={4} />
              </div>
            )}
            {modalType === 'quizzes' && (
              <div className="space-y-2">
                <Label>Preguntas (JSON)</Label>
                <Textarea value={typeof modalData.questions === 'object' ? JSON.stringify(modalData.questions, null, 2) : (modalData.questions || '[]')} onChange={e => {
                  try { setModalData({...modalData, questions: JSON.parse(e.target.value)}) } catch(err) { setModalData({...modalData, questions: e.target.value}) }
                }} rows={6} className="font-mono text-xs" />
                <p className="text-xs text-muted-foreground">Ingresa un array JSON válido con las preguntas.</p>
              </div>
            )}
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
