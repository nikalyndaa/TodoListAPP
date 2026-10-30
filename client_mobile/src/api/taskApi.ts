import { http } from "./http";
import { ILookup, ITask, ITaskFilters, ITaskPayload } from "@/types/tasks/ITask";

export const tasksApi = {
  getAll: (params?: ITaskFilters) =>
    http.get<ITask[]>("/tasks", { params }).then((r) => r.data),

  getById: (id: number) => http.get<ITask>(`/tasks/${id}`).then((r) => r.data),

  create: (data: ITaskPayload) =>
    http.post<ITask>("/tasks", data).then((r) => r.data),

  update: (id: number, data: ITaskPayload) =>
    http.put<ITask>(`/tasks/${id}`, data).then((r) => r.data),

  changeStatus: (id: number, statusId: number) =>
    http.patch<ITask>(`/tasks/${id}/status`, { statusId }).then((r) => r.data),

  remove: (id: number) => http.delete(`/tasks/${id}`),

  getStatuses: () => http.get<ILookup[]>("/tasks/statuses").then((r) => r.data),
  getPriorities: () =>
    http.get<ILookup[]>("/tasks/priorities").then((r) => r.data),
};