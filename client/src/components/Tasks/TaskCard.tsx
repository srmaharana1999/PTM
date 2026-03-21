import { Calendar, MoreVertical, ExternalLink } from 'lucide-react'
import type { ITask } from '@/lib/types'
import { TaskPriority, TaskStatus, ProjectRole } from '@/lib/types'
import { cn, formatDate, getInitials, isOverdue } from '@/lib/utils'

interface TaskCardProps {
  task: ITask
  userRole: string
  onEdit: (task: ITask) => void
  onView: (task: ITask) => void
}

const priorityColors: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  [TaskPriority.MEDIUM]: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  [TaskPriority.HIGH]: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
}

const TaskCard = ({ task, userRole, onEdit, onView }: TaskCardProps) => {
  const overdue = isOverdue(task.dueDate) && task.status !== TaskStatus.DONE
  const canEdit = userRole === ProjectRole.OWNER || userRole === ProjectRole.ADMIN

  return (
    <div
      onClick={() => onView(task)}
      className="group relative flex flex-col gap-2 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/50 hover:bg-white/[0.08] hover:shadow-[0_0_30px_rgba(139,92,246,0.1)] cursor-pointer"
    >
      {/* Top Section: Priority & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
              priorityColors[task.priority]
            )}
          >
            {task.priority}
          </span>
          {overdue && (
            <span className="rounded-full border border-rose-500/50 bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-500 animate-pulse">
              Overdue
            </span>
          )}
        </div>

        {canEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit(task)
            }}
            className="rounded-lg p-1 text-muted-foreground/50 hover:bg-white/10 hover:text-white transition-colors"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Content Section */}
      <div className="space-y-2">
        <h3 className="text-base font-semibold text-white/90 group-hover:text-white transition-colors line-clamp-1">
          {task.title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {task.description || 'No description provided.'}
        </p>
      </div>

      {/* Bottom Section: Assignee & Date */}
      <div className=" flex mt-2 items-center justify-between border-t border-white/5 pt-4">
        <div className="flex items-center gap-2">
          {task.assigneeId ? (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-fuchsia-500 text-[10px] font-bold text-white shadow-sm ring-1 ring-white/20">
              {getInitials(task.assigneeId.name)}
            </div>
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-white/20 bg-white/5 text-[10px] text-muted-foreground">
              ?
            </div>
          )}
          <span className="text-xs text-muted-foreground/80 truncate max-w-lg">
            {task.assigneeId?.name ?? 'Unassigned'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-muted-foreground/60">
            <Calendar className="h-3.5 w-3.5" />
            <span className="text-[11px] font-medium">{formatDate(task.dueDate)}</span>
          </div>
          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-violet-400 transition-colors" />
        </div>
      </div>

      {/* Hover Background Accent */}
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-600/5 blur-3xl group-hover:bg-violet-600/10 transition-colors" />
    </div>
  )
}

export default TaskCard
