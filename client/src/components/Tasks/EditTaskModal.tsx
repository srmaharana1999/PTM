import { useEffect } from 'react'
import { Form, Formik } from 'formik'
import {  Plus } from 'lucide-react'
import {  useUpdateTask } from '@/hooks/useTasks'
import { useGetProjectMembers } from '@/hooks/useMember'
import { taskSchema, type TaskValues } from '@/lib/schema/taskSchema'
import { TaskPriority, TaskStatus, type ITask } from '@/lib/types'
import { extractErrorMessage } from '@/lib/utils'
import toast from 'react-hot-toast'
import InputField from '../Fields/InputField'
import TextAreaField from '../Fields/TextAreaField'
import RadioGroupField from '../Fields/RadioGroudField'
import SelectField from '../Fields/SelectField'
import DatePicker from '../Fields/DatePicker'

interface IEditTaskForm {
  open: boolean
  projectId: string
  onClose: () => void
  initialValues: TaskValues
  task: ITask | null
}


const EditTaskForm = ({ open, projectId, onClose, initialValues,task }: IEditTaskForm) => {
  const updateTask = useUpdateTask()
  const { data: membersData } = useGetProjectMembers(projectId)
  const members = membersData?.data ?? []


  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open || !task) return null


  const handleUpdate = (values: TaskValues, { resetForm }: { resetForm: () => void }) => {
    updateTask.mutate(
      { id: task._id, data: values },
      {
        onSuccess: () => {
          toast.success('Task updated!')
          resetForm()
          onClose()
        },
        onError: (err) => {
          toast.error(extractErrorMessage(err))
        },
      }
    )
  }

  return (
        <Formik
          initialValues={initialValues}
          validationSchema={taskSchema}
          onSubmit={handleUpdate}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Title */}
                <InputField
                  type="text"
                  id="task-title"
                  label="Title"
                  name="title"
                  placeholder="Task title…"
                  isRequired
                />
                <TextAreaField
                  id="task-desc"
                  label="Description"
                  name="description"
                  placeholder="Describe the task…"
                  rows={4}
                  isRequired
                />
                <div className="grid grid-cols-2 gap-4">
                <RadioGroupField
                  options={[
                    { value: TaskPriority.LOW, label: 'Low' },
                    { value: TaskPriority.MEDIUM, label: 'Medium' },
                    { value: TaskPriority.HIGH, label: 'High' },
                  ]}
                  label="Priority"
                  name="priority"
                  id="task-priority"
                  isRequired
                />
                <RadioGroupField
                  options={[
                    { value: TaskStatus.TODO, label: 'To Do' },
                    { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
                    { value: TaskStatus.DONE, label: 'Done' },
                  ]}
                  label="Status"
                  name="status"
                  id="task-status"
                  isRequired
                />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DatePicker
                    id="task-due"
                    label="Due Date"
                    name="dueDate"
                    isRequired
                  />
                  <SelectField
                    id="task-assignee"
                    label="Assignee"
                    name="assigneeId"
                    placeholder="Select assignee"
                    options={members.map((m) => ({ value: m.user._id, label: m.user.name }))}
                    isRequired
                  />
                </div>
              </div>


              {/* Footer */}
              <div className="flex gap-3 px-6 py-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-md border border-white/15 bg-white/5 py-2.5 text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="create-task-submit"
                  type="submit"
                  disabled={isSubmitting || updateTask.isPending}
                  className="flex flex-1 items-center justify-center gap-2 rounded-md bg-linear-to-r from-violet-500 to-fuchsia-500 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {updateTask.isPending ? (
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create Task
                    </>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      
  )
}

export default EditTaskForm;
