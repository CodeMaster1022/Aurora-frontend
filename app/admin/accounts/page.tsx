'use client'

import { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import { Pencil, Plus, Trash2, Loader2, AlertTriangle } from 'lucide-react'
import { adminService } from '@/lib/services/adminService'
import { AdminUser } from '@/lib/types/admin'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import {
  ROLE_OPTIONS,
  STATUS_OPTIONS,
  statusBadgeStyles,
} from '@/components/admin/constants'

type UserFormState = {
  firstname: string
  lastname: string
  email: string
  password: string
  role: AdminUser['role']
  status: AdminUser['status']
  isActive: boolean
  cost?: number
  age?: number
  location?: string
  bio?: string
  meetingPreference?: string
}

const PAGE_SIZE_OPTIONS = ['10', '25', '50']

export default function AdminAccountsPage() {
  const { toast } = useToast()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    status: 'all',
    isActive: 'all',
    page: 1,
    limit: 10,
  })

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 10,
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [userForm, setUserForm] = useState<UserFormState>({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    role: 'learner',
    status: 'review',
    isActive: true,
    cost: undefined,
    age: undefined,
    location: '',
    bio: '',
    meetingPreference: '',
  })

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await adminService.getUsers({
          search: filters.search || undefined,
          role: filters.role === 'all' ? undefined : filters.role,
          status: filters.status === 'all' ? undefined : filters.status,
          isActive:
            filters.isActive === 'all'
              ? undefined
              : filters.isActive === 'true'
                ? true
                : false,
          page: filters.page,
          limit: filters.limit,
        })

        if (response.success) {
          setUsers(response.data.users)
          setPagination(response.data.pagination)
        }
      } catch (err) {
        console.error('Failed to load users', err)
        setError(
          err instanceof Error
            ? err.message
            : 'Something went wrong while fetching accounts.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    void fetchUsers()
  }, [filters])

  const resetForm = () => {
    setUserForm({
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      role: 'learner',
      status: 'review',
      isActive: true,
      cost: undefined,
      age: undefined,
      location: '',
      bio: '',
      meetingPreference: '',
    })
    setEditingUser(null)
  }

  const openCreateDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (user: AdminUser) => {
    setEditingUser(user)
    setUserForm({
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      email: user.email,
      password: '',
      role: user.role,
      status: user.status,
      isActive: user.isActive,
      cost: user.cost,
      age: user.age,
      location: user.location || '',
      bio: user.bio || '',
      meetingPreference: user.meetingPreference || '',
    })
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    resetForm()
  }

  const handleSaveUser = async () => {
    try {
      setIsSaving(true)
      if (editingUser) {
        await adminService.updateUser(editingUser._id, {
          ...userForm,
          password: userForm.password || undefined,
        })
        toast({
          title: 'Account updated',
          description: `${userForm.firstname || 'Account'} has been updated successfully.`,
        })
      } else {
        await adminService.createUser(userForm)
        toast({
          title: 'Account created',
          description: `${userForm.firstname || 'New'} account is ready.`,
        })
      }
      closeDialog()
      setFilters((prev) => ({ ...prev }))
    } catch (err) {
      console.error('Failed to save user', err)
      toast({
        title: 'Unable to save account',
        description:
          err instanceof Error ? err.message : 'Please review the details and try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      await adminService.deleteUser(userId)
      toast({
        title: 'Account removed',
        description: 'The account has been deleted.',
      })
      setFilters((prev) => ({ ...prev }))
    } catch (err) {
      console.error('Failed to delete user', err)
      toast({
        title: 'Deletion failed',
        description:
          err instanceof Error ? err.message : 'We were unable to remove this account.',
        variant: 'destructive',
      })
    }
  }

  const handleStatusChange = async (userId: string, status: AdminUser['status']) => {
    try {
      await adminService.updateUserStatus(userId, { status })
      toast({
        title: 'Status updated',
        description: 'Account status has been refreshed.',
      })
      setFilters((prev) => ({ ...prev }))
    } catch (err) {
      console.error('Failed to update status', err)
      toast({
        title: 'Update failed',
        description:
          err instanceof Error ? err.message : 'Could not update the status for this account.',
        variant: 'destructive',
      })
    }
  }

  const handleActiveToggle = async (userId: string, isActive: boolean) => {
    try {
      await adminService.updateUserStatus(userId, { isActive })
      toast({
        title: isActive ? 'Account activated' : 'Account deactivated',
        description: 'The account availability has been updated.',
      })
      setFilters((prev) => ({ ...prev }))
    } catch (err) {
      console.error('Failed to toggle account', err)
      toast({
        title: 'Update failed',
        description:
          err instanceof Error ? err.message : 'We could not update this account.',
        variant: 'destructive',
      })
    }
  }

  const disablePrev = useMemo(() => filters.page <= 1 || isLoading, [filters.page, isLoading])
  const disableNext = useMemo(
    () => filters.page >= pagination.pages || isLoading,
    [filters.page, pagination.pages, isLoading],
  )

  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-white">Accounts</h2>
        <p className="text-sm text-indigo-200">
          Approve, fine-tune, or sunset community members.
        </p>
      </header>

      {error ? (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <Card className="bg-white/5 text-white backdrop-blur-lg">
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-lg font-semibold text-indigo-50">
            Directory
          </CardTitle>
          <Button onClick={openCreateDialog} className="bg-indigo-500 hover:bg-indigo-600">
            <Plus className="mr-2 h-4 w-4" />
            New account
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-6">
            <Input
              placeholder="Search by name or email"
              value={filters.search}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  search: event.target.value,
                  page: 1,
                }))
              }
              className="md:col-span-2 bg-white/10 text-white placeholder:text-indigo-200/60"
            />
            <Select
              value={filters.role}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  role: value,
                  page: 1,
                }))
              }
            >
              <SelectTrigger className="bg-white/10 text-white md:col-span-1">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 text-indigo-100">
                <SelectItem value="all">All roles</SelectItem>
                {ROLE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  status: value,
                  page: 1,
                }))
              }
            >
              <SelectTrigger className="bg-white/10 text-white md:col-span-1">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 text-indigo-100">
                <SelectItem value="all">All statuses</SelectItem>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.isActive}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  isActive: value,
                  page: 1,
                }))
              }
            >
              <SelectTrigger className="bg-white/10 text-white md:col-span-1">
                <SelectValue placeholder="Active state" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 text-indigo-100">
                <SelectItem value="all">Active + paused</SelectItem>
                <SelectItem value="true">Active only</SelectItem>
                <SelectItem value="false">Deactivated</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={String(filters.limit)}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  limit: Number(value),
                  page: 1,
                }))
              }
            >
              <SelectTrigger className="bg-white/10 text-white md:col-span-1">
                <SelectValue placeholder="Page size" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 text-indigo-100">
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option} / page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="hidden overflow-hidden rounded-lg border border-white/10 sm:block">
            <div className="max-w-full overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader className="bg-white/10 text-sm uppercase tracking-wide text-indigo-200">
                  <TableRow>
                    <TableHead className="text-indigo-200">User</TableHead>
                    <TableHead className="text-indigo-200">Role</TableHead>
                    <TableHead className="text-indigo-200">Status</TableHead>
                    <TableHead className="text-indigo-200">Active</TableHead>
                    <TableHead className="text-indigo-200">Calendar</TableHead>
                    <TableHead className="text-indigo-200">Joined</TableHead>
                    <TableHead className="text-right text-indigo-200">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <div className="flex items-center justify-center py-10 text-indigo-200">
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Fetching latest accounts...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <div className="flex flex-col items-center justify-center py-10 text-indigo-200">
                          <AlertTriangle className="mb-2 h-8 w-8 text-amber-300" />
                          <p>No accounts match the current filters.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user._id} className="border-white/5 hover:bg-white/5">
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-semibold text-white">
                              {user.firstname} {user.lastname}
                            </span>
                            <span className="text-sm text-indigo-200/70">{user.email}</span>
                          </div>
                        </TableCell>
                        <TableCell className="capitalize text-indigo-100">
                          {user.role}
                        </TableCell>
                        <TableCell>
                          <Badge className={clsx('capitalize', statusBadgeStyles[user.status])}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={user.isActive}
                            onCheckedChange={(checked) => handleActiveToggle(user._id, checked)}
                          />
                        </TableCell>
                        <TableCell className="text-indigo-100">
                          {user.googleCalendar?.connected ? (
                            <span className="text-emerald-300">Connected</span>
                          ) : (
                            <span className="text-indigo-200/70">Not linked</span>
                          )}
                        </TableCell>
                        <TableCell className="text-indigo-100">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="flex justify-end gap-2">
                          <Select
                            value={user.status}
                            onValueChange={(value: AdminUser['status']) =>
                              handleStatusChange(user._id, value)
                            }
                          >
                            <SelectTrigger className="w-[140px] bg-transparent text-indigo-100">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 text-indigo-100">
                              {STATUS_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openEditDialog(user)}
                            className="text-indigo-100 hover:bg-indigo-500/20"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-rose-300 hover:bg-rose-500/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="space-y-3 sm:hidden">
            {isLoading ? (
              <div className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 py-10 text-indigo-200">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Fetching latest accounts...
              </div>
            ) : users.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/20 bg-white/5 py-10 text-indigo-200">
                <AlertTriangle className="mb-2 h-8 w-8 text-amber-300" />
                <p>No accounts match the current filters.</p>
              </div>
            ) : (
              users.map((user) => (
                <div
                  key={user._id}
                  className="rounded-2xl border border-white/15 bg-white/5 p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-white">
                        {user.firstname} {user.lastname}
                      </p>
                      <p className="text-xs text-indigo-200/80">{user.email}</p>
                    </div>
                    <Badge className={clsx('capitalize', statusBadgeStyles[user.status])}>
                      {user.status}
                    </Badge>
                  </div>

                  <div className="mt-4 space-y-3 text-xs text-indigo-200/80">
                    <div className="flex justify-between">
                      <span className="uppercase tracking-wide text-[11px] text-indigo-300/70">
                        Role
                      </span>
                      <span className="text-sm text-white capitalize">{user.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="uppercase tracking-wide text-[11px] text-indigo-300/70">
                        Joined
                      </span>
                      <span className="text-sm text-white">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="uppercase tracking-wide text-[11px] text-indigo-300/70">
                        Active
                      </span>
                      <span className="text-sm text-white">
                        {user.isActive ? 'Active' : 'Paused'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="uppercase tracking-wide text-[11px] text-indigo-300/70">
                        Calendar
                      </span>
                      <span className="text-sm text-white">
                        {user.googleCalendar?.connected ? 'Connected' : 'Not linked'}
                      </span>
                    </div>
                    {user.cost !== undefined && (
                      <div className="flex justify-between">
                        <span className="uppercase tracking-wide text-[11px] text-indigo-300/70">
                          Session Cost
                        </span>
                        <span className="text-sm text-white">${user.cost}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex flex-col gap-2">
                    <Select
                      value={user.status}
                      onValueChange={(value: AdminUser['status']) =>
                        handleStatusChange(user._id, value)
                      }
                    >
                      <SelectTrigger className="w-full bg-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 text-indigo-100">
                        {STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                      <span className="text-xs text-indigo-200/80">Active</span>
                      <Switch
                        checked={user.isActive}
                        onCheckedChange={(checked) => handleActiveToggle(user._id, checked)}
                      />
                    </div>
                    <div className="flex w-full gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 border-indigo-400/40 bg-indigo-400/10 text-indigo-100 hover:bg-indigo-400/20"
                        onClick={() => openEditDialog(user)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-rose-400/40 bg-rose-400/10 text-rose-200 hover:bg-rose-400/20"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex flex-col items-start justify-between gap-3 text-sm text-indigo-100 sm:flex-row sm:items-center">
            <div>
              Page {pagination.page} of {pagination.pages} — {pagination.total} members
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-white/20 text-foreground hover:bg-white/10"
                disabled={disablePrev}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: Math.max(prev.page - 1, 1),
                  }))
                }
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-white/20 text-foreground hover:bg-white/10"
                disabled={disableNext}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: Math.min(prev.page + 1, pagination.pages),
                  }))
                }
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-slate-950/95 text-white">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit account' : 'Create new account'}</DialogTitle>
            <DialogDescription className="text-indigo-100">
              Configure permissions, status, and optional speaker details.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstname">First name</Label>
              <Input
                id="firstname"
                value={userForm.firstname}
                onChange={(event) =>
                  setUserForm((prev) => ({ ...prev, firstname: event.target.value }))
                }
                className="bg-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastname">Last name</Label>
              <Input
                id="lastname"
                value={userForm.lastname}
                onChange={(event) =>
                  setUserForm((prev) => ({ ...prev, lastname: event.target.value }))
                }
                className="bg-white/10 text-white"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userForm.email}
                onChange={(event) =>
                  setUserForm((prev) => ({ ...prev, email: event.target.value }))
                }
                className="bg-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={userForm.role}
                onValueChange={(value: AdminUser['role']) =>
                  setUserForm((prev) => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger id="role" className="bg-white/10 text-white">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 text-indigo-100">
                  {ROLE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={userForm.status}
                onValueChange={(value: AdminUser['status']) =>
                  setUserForm((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger id="status" className="bg-white/10 text-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 text-indigo-100">
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="password">{editingUser ? 'Password (optional)' : 'Password'}</Label>
              <Input
                id="password"
                type="password"
                value={userForm.password}
                placeholder={editingUser ? 'Leave blank to keep current password' : ''}
                onChange={(event) =>
                  setUserForm((prev) => ({ ...prev, password: event.target.value }))
                }
                className="bg-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">Session cost (USD)</Label>
              <Input
                id="cost"
                type="number"
                min={0}
                value={userForm.cost ?? ''}
                onChange={(event) =>
                  setUserForm((prev) => ({
                    ...prev,
                    cost: event.target.value ? Number(event.target.value) : undefined,
                  }))
                }
                className="bg-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                min={0}
                value={userForm.age ?? ''}
                onChange={(event) =>
                  setUserForm((prev) => ({
                    ...prev,
                    age: event.target.value ? Number(event.target.value) : undefined,
                  }))
                }
                className="bg-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={userForm.location ?? ''}
                onChange={(event) =>
                  setUserForm((prev) => ({ ...prev, location: event.target.value }))
                }
                className="bg-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meetingPreference">Meeting preference</Label>
              <Input
                id="meetingPreference"
                value={userForm.meetingPreference ?? ''}
                onChange={(event) =>
                  setUserForm((prev) => ({ ...prev, meetingPreference: event.target.value }))
                }
                className="bg-white/10 text-white"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={userForm.bio ?? ''}
                onChange={(event) =>
                  setUserForm((prev) => ({ ...prev, bio: event.target.value }))
                }
                className="bg-white/10 text-white"
              />
            </div>
            <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3 sm:col-span-2">
              <div>
                <p className="text-sm font-medium">Active account</p>
                <p className="text-xs text-indigo-200">
                  Disable to freeze access without deleting.
                </p>
              </div>
              <Switch
                checked={userForm.isActive}
                onCheckedChange={(checked) =>
                  setUserForm((prev) => ({ ...prev, isActive: checked }))
                }
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                editingUser ? 'Save changes' : 'Create account'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}

