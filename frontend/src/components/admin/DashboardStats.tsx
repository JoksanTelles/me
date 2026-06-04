import React, { useEffect, useState } from "react"
import { pb } from "@/lib/pocketbase"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardStats() {
  const [stats, setStats] = useState({ users: 0, courses: 0, purchasesCount: 0, revenue: 0 })
  const [recentUsers, setRecentUsers] = useState<any[]>([])
  const [recentPurchases, setRecentPurchases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const u = await pb.collection('users').getList(1, 5, { sort: '-created' })
        const c = await pb.collection('courses').getList(1, 1)
        const p = await pb.collection('purchases').getList(1, 5, { sort: '-created', expand: 'user_id,course_id' })
        const allP = await pb.collection('purchases').getFullList()
        
        const revenue = allP.reduce((sum, item) => sum + (item.amount || 0), 0)

        setStats({
          users: u.totalItems,
          courses: c.totalItems,
          purchasesCount: allP.length,
          revenue
        })
        setRecentUsers(u.items)
        setRecentPurchases(p.items)
      } catch(e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="p-4 md:p-8 space-y-6 w-full max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight">Resumen General</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-[120px] rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[400px] lg:col-span-2 rounded-xl" />
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 space-y-6 w-full max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resumen General</h1>
        <p className="text-muted-foreground mt-1">Métricas clave e información en tiempo real.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
              Ingresos Totales
            </CardTitle>
            <span className="material-symbols-outlined text-muted-foreground text-[18px]">payments</span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${stats.revenue.toFixed(2)} USD</div>
            <p className="text-xs text-green-600 font-medium flex items-center mt-1">
              <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span>
              +12% este mes
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
              Usuarios Activos
            </CardTitle>
            <span className="material-symbols-outlined text-muted-foreground text-[18px]">group</span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.users}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +3 nuevos hoy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
              Ventas
            </CardTitle>
            <span className="material-symbols-outlined text-muted-foreground text-[18px]">shopping_bag</span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.purchasesCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Últimos 30 días
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
              Cursos Publicados
            </CardTitle>
            <span className="material-symbols-outlined text-muted-foreground text-[18px]">school</span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.courses}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Catálogo actual
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ÚLTIMAS VENTAS */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Últimas Ventas</CardTitle>
            <CardDescription>
              Transacciones completadas recientemente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentPurchases.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-sm">No hay ventas registradas.</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Comprador</TableHead>
                      <TableHead>Curso</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Monto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentPurchases.map(p => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">
                          {p.expand?.user_id?.name || p.expand?.user_id?.email || p.user_id}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                          {p.expand?.course_id?.title || p.course_id}
                        </TableCell>
                        <TableCell>
                          <Badge variant={p.status === 'completed' ? 'default' : 'secondary'} className="uppercase text-[10px] tracking-wider">
                            {p.status || 'Completado'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${p.amount?.toFixed(2) || '0.00'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* NUEVOS USUARIOS */}
        <Card>
          <CardHeader>
            <CardTitle>Nuevos Usuarios</CardTitle>
            <CardDescription>
              Últimas cuentas registradas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentUsers.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-sm">No hay usuarios nuevos.</div>
            ) : (
              <div className="space-y-6">
                {recentUsers.map(u => (
                  <div key={u.id} className="flex items-center">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${u.username || u.id}`} alt="Avatar" />
                      <AvatarFallback>{(u.name || u.username || 'U')[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">{u.name || u.username || 'Sin Nombre'}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-[150px]">
                        {u.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
