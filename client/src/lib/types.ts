// enums

export const ProjectRole = {
  OWNER: "owner",
  ADMIN: "admin",
  MEMBER: "member",
} as const;

export type ProjectRole = (typeof ProjectRole)[keyof typeof ProjectRole];

export const ProjectStatus = {
  ACTIVE: "active",
  COMPLETED: "completed",
} as const;

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];

export const TaskStatus = {
  TODO: "todo",
  IN_PROGRESS: "in-progress",
  DONE: "done",
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export const TaskPriority = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;

export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority];

export type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

export type Owner = Omit<User, "role">;

export interface IProject {
  _id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  members: string[];
  createdAt: string;
  owner: Owner;
}

export interface IUpdateProjectValue {
  title?: string;
  description?: string;
  status?: ProjectStatus;
  members?: string[];
}

export type Assignee = Omit<User, "role">;
export type Creator = Omit<User, "role">;
export type Project = {
  _id: string;
  title: string;
};

export interface ITask {
  _id: string;
  title: string;
  description: string;
  creator: Creator;
  project: Project;
  assignee: Assignee;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
}

export interface IProjectMember {
  _id: string;
  user: Assignee;
  project: string;
  role: ProjectRole;
}

export interface ApiResponse<T> {
  message: string;
  data?: T;
}
