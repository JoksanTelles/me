import React, { useEffect, useState } from "react"
import { pb } from "@/lib/pocketbase"
import { getCollectionConfig } from "@/lib/adminConfig"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"

interface DataTableProps {
  collectionId: string
  baseRoute: string
  editUrlParam?: string
}

export function DataTable({ collectionId, baseRoute, editUrlParam = 'id' }: DataTableProps) {
  const config = getCollectionConfig(collectionId)
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [relationsData, setRelationsData] = useState<Record<string, any[]>>({})

  const fetchRecords = async () => {
    setLoading(true)
    try {
      const data = await pb.collection(collectionId).getFullList({ sort: '-created' })
      setRecords(data)
    } catch(e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelations = async () => {
    if (!config) return
    const newRelationsData = { ...relationsData }
    for (const field of config.fields) {
      if (field.type === 'relation' && (field as any).collection) {
        const collection = (field as any).collection
        if (!newRelationsData[collection]) {
          try {
            const rels = await pb.collection(collection).getFullList()
            newRelationsData[collection] = rels
          } catch(e) {}
        }
      }
    }
    setRelationsData(newRelationsData)
  }

  useEffect(() => {
    fetchRecords()
    fetchRelations()
  }, [collectionId])

  const getRelationDisplay = (field: any, id: string) => {
    if (!id) return '-'
    const rels = relationsData[field.collection]
    if (!rels) return id
    const item = rels.find(r => r.id === id)
    return item ? (item[field.display] || item.id) : id
  }

  const getEditUrl = (record: any) => {
    if (collectionId === 'users') {
      return `${baseRoute}/@${record.username}`
    }
    return `${baseRoute}/${record[editUrlParam]}`
  }

  const deleteRecord = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este registro?')) {
      await pb.collection(collectionId).delete(id)
      await fetchRecords()
    }
  }

  if (!config) return null

  return (
    <div className="p-4 md:p-8 space-y-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{config.name}</h1>
          <p className="text-muted-foreground mt-1">Administrando registros de {config.id}</p>
        </div>
        <Button asChild>
          <a href={`${baseRoute}/new`}>
            <span className="material-symbols-outlined text-[18px] mr-2">add</span>
            Nuevo Registro
          </a>
        </Button>
      </div>

      <div className="rounded-md border bg-card text-card-foreground shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                {config.fields.map((field: any) => (
                  <TableHead key={field.name} className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                    {field.label || field.name}
                  </TableHead>
                ))}
                <TableHead className="text-right font-semibold text-xs uppercase tracking-wider text-muted-foreground w-[100px]">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {config.fields.map((f: any) => (
                      <TableCell key={f.name}>
                        <Skeleton className="h-5 w-[80%]" />
                      </TableCell>
                    ))}
                    <TableCell>
                      <Skeleton className="h-8 w-8 rounded-md ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={config.fields.length + 1} className="h-24 text-center">
                    No hay registros aún.
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => (
                  <TableRow key={record.id}>
                    {config.fields.map((field: any) => (
                      <TableCell key={field.name} className="max-w-[250px] truncate text-sm">
                        {field.type === 'relation' ? (
                          getRelationDisplay(field, record[field.name])
                        ) : field.type === 'boolean' ? (
                          <span className={record[field.name] ? 'text-green-600 font-medium' : 'text-muted-foreground'}>
                            {record[field.name] ? 'Sí' : 'No'}
                          </span>
                        ) : field.type === 'tiptap' ? (
                          <span className="text-muted-foreground italic">Contenido Tiptap</span>
                        ) : (
                          <span title={typeof record[field.name] === 'object' ? JSON.stringify(record[field.name]) : record[field.name]}>
                            {typeof record[field.name] === 'object' ? JSON.stringify(record[field.name]) : record[field.name]}
                          </span>
                        )}
                      </TableCell>
                    ))}
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
                            <a href={getEditUrl(record)} className="cursor-pointer">
                              <span className="material-symbols-outlined text-[16px] mr-2">edit</span>
                              Editar
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => deleteRecord(record.id)} className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950">
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
