export interface ITask {
  id: number;
  title: string;
  description?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  dueDate?: string | null;
  completedAt?: string | null;
  statusId: number;
  status: string;
  priorityId: number;
  priority: string;
}

export interface ILookup {
  id: number;
  name: string;
}

export interface ITaskPayload {
  title: string;
  description?: string | null;
  dueDate?: string | null;
  statusId: number;
  priorityId: number;
}

export interface ITaskFilters {
  statusId?: number;
  priorityId?: number;
  search?: string;
}