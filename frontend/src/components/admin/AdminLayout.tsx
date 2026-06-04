import React from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "./AppSidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbLink } from "@/components/ui/breadcrumb"

export function AdminLayout({ children, activePath, title }: { children: React.ReactNode, activePath: string, title: string }) {
  const segments = activePath.split('/').filter(Boolean);

  return (
    <SidebarProvider>
      <AppSidebar activePath={activePath} />
      <SidebarInset className="bg-background">
        <div className="flex items-center gap-2 px-4 pt-4 md:px-6 md:pt-6">
          <SidebarTrigger className="-ml-2" />
          <Separator orientation="vertical" className="mx-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {segments.map((seg, index) => {
                const isLast = index === segments.length - 1;
                const url = '/' + segments.slice(0, index + 1).join('/');
                const label = seg.charAt(0).toUpperCase() + seg.slice(1);
                return (
                  <React.Fragment key={url}>
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>{title}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={url}>{label}</BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <main className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
