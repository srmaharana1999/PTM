import { TaskStatusBadge, EmptyState } from '@/components/shared'
import TaskCard from './TaskCard'
import { CheckSquare } from 'lucide-react'
import type { ITask, TaskStatus } from '@/lib/types'
import { TaskStatus as TS } from '@/lib/types'

interface Column {
  id: TaskStatus
  label: string
  accent: string
  headerBg: string
}

const COLUMNS: Column[] = [
  {
    id: TS.TODO,
    label: 'To Do',
    accent: 'border-slate-500/30',
    headerBg: 'bg-slate-500/10',
  },
  {
    id: TS.IN_PROGRESS,
    label: 'In Progress',
    accent: 'border-amber-500/30',
    headerBg: 'bg-amber-500/10',
  },
  {
    id: TS.DONE,
    label: 'Done',
    accent: 'border-emerald-500/30',
    headerBg: 'bg-emerald-500/10',
  },
]

interface KanbanBoardProps {
  tasks: ITask[]
  userRole: string
  onEditTask: (task: ITask) => void
  onViewTask: (task: ITask) => void
}

const KanbanBoard = ({ tasks, userRole, onEditTask, onViewTask }: KanbanBoardProps) => {
  const byStatus = (status: TaskStatus) => tasks.filter((t) => t.status === status)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {COLUMNS.map((col) => {
        const colTasks = byStatus(col.id)
        return (
          <div key={col.id} className={`rounded-2xl border ${col.accent} bg-white/3 flex flex-col`}>
            {/* Column header */}
            <div
              className={`flex items-center justify-between px-4 py-3 rounded-t-2xl ${col.headerBg} border-b ${col.accent}`}
            >
              <div className="flex items-center gap-2">
                <TaskStatusBadge status={col.id} />
              </div>
              <span className="text-xs font-semibold text-muted-foreground">{colTasks.length}</span>
            </div>

            {/* Cards */}
            <div className=" p-3 space-y-4 flex-1 overflow-y-scroll max-h-[60vh] scroll">
              {colTasks.length === 0 ? (
                <EmptyState
                  icon={CheckSquare}
                  title="No tasks here"
                  className="py-6 border-0 bg-transparent"
                />
              ) : (
                colTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    userRole={userRole}
                    onEdit={onEditTask}
                    onView={onViewTask}
                  />
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default KanbanBoard
