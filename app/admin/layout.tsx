'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { getCurrentUser } from '@/lib/store/authSlice'
import { cn } from '@/lib/utils'
import {
  Loader2,
  ShieldAlert,
  BarChart3,
  Users,
  MessageSquare,
  Sparkles,
  Menu,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { logoutUser } from '@/lib/store/authSlice'
import { useRouter } from 'next/navigation'

const NAV_LINKS = [
  { href: '/admin/dashboard', label: 'Overview', icon: BarChart3, description: 'Live metrics and platform health' },
  { href: '/admin/accounts', label: 'Accounts', icon: Users, description: 'Manage learners and guides' },
  { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare, description: 'Moderate community feedback' },
  { href: '/admin/spotlight', label: 'Spotlight', icon: Sparkles, description: 'Celebrate standout guides' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const { user, isAuthenticated, isLoading: authLoading } = useAppSelector((state) => state.auth)
  const [isInitializing, setIsInitializing] = useState(true)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && !user && !authLoading) {
      dispatch(getCurrentUser())
    }
  }, [dispatch, isAuthenticated, user, authLoading])

  useEffect(() => {
    if (!authLoading) {
      setIsInitializing(false)
    }
  }, [authLoading])

  const isAuthorized = useMemo(
    () => !!user && ['admin', 'moderator'].includes(user.role),
    [user],
  )

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#05051A] via-[#120A3A] to-[#05051A]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 px-6 text-center text-white">
        <ShieldAlert className="mb-4 h-14 w-14 text-indigo-300" />
        <h1 className="text-3xl font-semibold">Admins only</h1>
        <p className="mt-2 max-w-lg text-indigo-100">
          This control room is reserved for administrators and moderators. If you need access,
          please reach out to the platform owner.
        </p>
      </div>
    )
  }

  const renderSidebarContent = (collapsed = false) => (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          'flex h-full flex-col bg-[#0D0B1F] text-indigo-100 transition-all duration-300',
          collapsed ? 'items-center px-2' : 'px-0',
        )}
      >
        <div
          className={cn(
            'border-b border-white/10 px-5 py-4 transition-all duration-300',
            collapsed && 'px-2',
          )}
        >
          <div
            className={cn(
              'flex items-center gap-3',
              collapsed && 'flex-col gap-2',
            )}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-700 text-white shadow-lg">
              <Sparkles className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div>
                <p className="text-sm font-medium text-indigo-200">Aurora Admin</p>
                <p className="text-xs text-indigo-300/80">Mission Control</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'mt-4 h-8 w-8 rounded-full text-indigo-200 hover:bg-white/10',
              collapsed && 'mx-auto',
            )}
            onClick={() => setIsCollapsed((prev) => !prev)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </div>

        <ScrollArea className={cn('flex-1 px-3 py-6', collapsed && 'px-2')}>
          <div className="space-y-3">
            {NAV_LINKS.map(({ href, label, icon: Icon, description }) => {
              const isActive = pathname === href
              const linkContent = (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className={cn(
                    'group relative flex w-full items-center gap-3 rounded-xl border border-transparent bg-white/5 px-4 py-3 text-sm font-semibold transition',
                    'hover:border-white/10 hover:bg-white/10',
                    isActive && 'border-white/30 bg-white/15 text-white shadow-inner',
                    collapsed && 'justify-center px-2 py-3',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-indigo-200 transition-all',
                      isActive && 'bg-white text-[#0D0B1F]',
                    )}
                  >
                    <Icon className={cn('h-4 w-4', isActive ? 'text-[#0D0B1F]' : 'text-indigo-200')} />
                  </span>
                  {!collapsed && (
                    <span className="flex flex-1 flex-col text-left">
                      {label}
                      <span className="mt-1 text-xs font-normal text-indigo-200/70">
                        {description}
                      </span>
                    </span>
                  )}
                </Link>
              )

              if (collapsed) {
                return (
                  <Tooltip key={href}>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side="right" className="bg-white/95 text-[#0D0B1F]">
                      <div className="text-sm font-semibold">{label}</div>
                      <div className="text-xs text-[#0D0B1F]/70">{description}</div>
                    </TooltipContent>
                  </Tooltip>
                )
              }

              return linkContent
            })}
          </div>
        </ScrollArea>

        <div
          className={cn(
            'border-t border-white/10 px-5 py-4 text-xs text-indigo-300/80 transition-all duration-300',
            collapsed && 'px-2 text-center',
          )}
        >
          {!collapsed && (
            <>
              <p className="font-semibold text-indigo-200">Aurora status</p>
              <p className="mt-1">All systems operational.</p>
              <Button
                variant="ghost"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 text-sm text-indigo-200 transition hover:bg-white/10"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </>
          )}
          {collapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="mx-auto mt-3 h-10 w-10 rounded-full border border-white/10 bg-white/5 text-indigo-200 transition hover:bg-white/10"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Sign out</span>
            </Button>
          )}
        </div>
      </div>
    </TooltipProvider>
  )

  const handleLogout = async () => {
    await dispatch(logoutUser())
    setIsMobileSidebarOpen(false)
    router.push('/')
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#05051A] via-[#120A3A] to-[#05051A] text-white">
      <aside
        className={cn(
          'hidden shrink-0 border-r border-white/10 bg-[#0D0B1F] transition-all duration-300 lg:flex',
          isCollapsed ? 'w-20' : 'w-72',
        )}
      >
        <div className="sticky top-0 h-screen w-full">
          {renderSidebarContent(isCollapsed)}
        </div>
      </aside>

      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <SheetContent side="left" className="w-72 border-r border-white/10 bg-[#0D0B1F] p-0 text-white lg:hidden">
          {renderSidebarContent(false)}
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 flex-col">
        <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-white/10 bg-[#05051A]/90 px-4 py-3 backdrop-blur lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={() => setIsMobileSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open navigation</span>
          </Button>
          <div>
            <p className="text-sm font-medium text-indigo-200">Aurora Control Hub</p>
            <p className="text-xs text-indigo-300/70">Manage the platform from one place</p>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto px-4 pt-8 sm:px-6 lg:px-10">
          <header className="mb-4 flex flex-col gap-4">
            <Badge className="w-fit bg-white/10 px-4 py-1 text-xs uppercase tracking-wider text-indigo-200">
              Aurora Control Hub
            </Badge>
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">Admin Mission Control</h1>
            </div>
          </header>

          <div className="space-y-12 pb-12">
            {children}
          </div>
        </main>

        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#0D0B1F]/95 px-4 py-3 backdrop-blur lg:hidden">
          <div className="mx-auto flex w-full max-w-md items-center justify-between text-xs font-medium text-indigo-200">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex flex-1 flex-col items-center gap-1 rounded-lg px-2 py-2 transition',
                    isActive
                      ? 'text-white'
                      : 'text-indigo-200/70 hover:text-white',
                  )}
                  onClick={() => setIsMobileSidebarOpen(false)}
                >
                  <Icon className={cn('h-5 w-5', isActive ? 'text-white' : 'text-indigo-200/70')} />
                  <span>{label}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </div>
  )
}

