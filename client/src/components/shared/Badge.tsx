import { type TaskStatus, type TaskPriority, type ProjectStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

// ── Generic Badge ─────────────────────────────────────────────────────────────

interface BadgeProps {
  children: React.ReactNode
  className?: string
}

export const Badge = ({ children, className }: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide',
      className
    )}
  >
    {children}
  </span>
)

// ── StatusBadge ───────────────────────────────────────────────────────────────

const taskStatusStyles: Record<TaskStatus, string> = {
  todo: 'bg-slate-500/20 text-slate-300 border border-slate-500/30',
  'in-progress': 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  done: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
}

const taskStatusLabels: Record<TaskStatus, string> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
}

const projectStatusStyles: Record<ProjectStatus, string> = {
  active: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  completed: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
}

const projectStatusLabels: Record<ProjectStatus, string> = {
  active: 'Active',
  completed: 'Completed',
}

interface TaskStatusBadgeProps {
  status: TaskStatus
  className?: string
}

interface ProjectStatusBadgeProps {
  status: ProjectStatus
  className?: string
}

export const TaskStatusBadge = ({ status, className }: TaskStatusBadgeProps) => (
  <Badge className={cn(taskStatusStyles[status], className)}>{taskStatusLabels[status]}</Badge>
)

export const ProjectStatusBadge = ({ status, className }: ProjectStatusBadgeProps) => (
  <Badge className={cn(projectStatusStyles[status], className)}>
    {projectStatusLabels[status]}
  </Badge>
)

// ── PriorityBadge ─────────────────────────────────────────────────────────────

const priorityStyles: Record<TaskPriority, string> = {
  low: 'bg-sky-500/20 text-sky-300 border border-sky-500/30',
  medium: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
  high: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
}

const priorityLabels: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

interface PriorityBadgeProps {
  priority: TaskPriority
  className?: string
}

export const PriorityBadge = ({ priority, className }: PriorityBadgeProps) => (
  <Badge className={cn(priorityStyles[priority], className)}>{priorityLabels[priority]}</Badge>
)
