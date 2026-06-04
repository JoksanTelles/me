import React, { useEffect, useState } from "react"
import { pb } from "@/lib/pocketbase"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

export function CoursesTable() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [studentCounts, setStudentCounts] = useState<Record<string, number>>({})

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const data = await pb.collection('courses').getFullList({ sort: '-created' })
      setCourses(data)

      // Fetch student counts (purchases per course)
      const purchases = await pb.collection('purchases').getFullList({ fields: 'course_id,status' })
      const counts: Record<string, number> = {}
      for (const p of purchases) {
        if (!counts[p.course_id]) counts[p.course_id] = 0
        counts[p.course_id]++
      }
      setStudentCounts(counts)
    } catch(e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const deleteRecord = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este curso?')) {
      await pb.collection('courses').delete(id)
      await fetchCourses()
    }
  }

  const getImageUrl = (record: any) => {
    if (record.cover) {
      return pb.files.getURL(record, record.cover, { thumb: '100x100' })
    }
    return null
  }

  return (
    <div className="p-4 md:p-8 space-y-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cursos</h1>
          <p className="text-muted-foreground mt-1">Administrando el catálogo de cursos</p>
        </div>
        <Button asChild>
          <a href="/admin/cursos/new">
            <span className="material-symbols-outlined text-[18px] mr-2">add</span>
            Nuevo Curso
          </a>
        </Button>
      </div>

      <div className="rounded-md border bg-card text-card-foreground shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground w-[80px]">Portada</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Título</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Estado</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Precio</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Alumnos</TableHead>
                <TableHead className="text-right font-semibold text-xs uppercase tracking-wider text-muted-foreground w-[100px]">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-12 w-16 rounded-md" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-[200px]" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-[80px]" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-[60px]" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-[40px]" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 rounded-md ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No hay cursos aún.
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      {getImageUrl(course) ? (
                        <img src={getImageUrl(course) || undefined} alt={course.title} className="w-16 h-10 object-cover rounded shadow-sm border" />
                      ) : (
                        <div className="w-16 h-10 bg-muted rounded flex items-center justify-center border text-muted-foreground">
                          <span className="material-symbols-outlined text-[18px]">image_not_supported</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium max-w-[250px] truncate">
                      {course.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant={course.status === 'published' ? 'default' : course.status === 'draft' ? 'secondary' : 'destructive'} className="uppercase text-[10px]">
                        {course.status || 'draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {course.price > 0 ? (
                        <span className="font-semibold">${course.price}</span>
                      ) : (
                        <span className="text-green-600 font-bold uppercase text-xs">Gratis</span>
                      )}
                      {course.discount_price > 0 && <span className="text-xs text-muted-foreground line-through block">${course.price}</span>}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 font-medium">
                        <span className="material-symbols-outlined text-muted-foreground text-[16px]">group</span>
                        {studentCounts[course.id] || 0}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <span className="material-symbols-outlined text-[18px]">more_vert</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <a href={`/cursos/${course.slug}`} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                              <span className="material-symbols-outlined text-[16px] mr-2">visibility</span>
                              Ver Curso
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <a href={`/admin/cursos/${course.slug}`} className="cursor-pointer">
                              <span className="material-symbols-outlined text-[16px] mr-2">edit</span>
                              Editar
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <a href={`/admin/cursos/${course.slug}/estudiantes`} className="cursor-pointer">
                              <span className="material-symbols-outlined text-[16px] mr-2">school</span>
                              Estudiantes
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <a href={`/admin/cursos/${course.slug}/resenas`} className="cursor-pointer">
                              <span className="material-symbols-outlined text-[16px] mr-2">star</span>
                              Reseñas
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => deleteRecord(course.id)} className="text-destructive focus:text-destructive cursor-pointer">
                            <span className="material-symbols-outlined text-[16px] mr-2">delete</span>
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
