import { z } from "zod";

export const TaskSchema = z.object({
  title: z.string().trim().min(1, "Вкажіть назву").max(200, "Максимум 200 символів"),
  description: z.string().max(2000, "Максимум 2000 символів").optional(),
  dueDate: z.string().regex(/^(\d{4}-\d{2}-\d{2})?$/, "Формат: РРРР-ММ-ДД"),
  statusId: z.number().min(1, "Оберіть статус"),
  priorityId: z.number().min(1, "Оберіть пріоритет"),
});

export type TaskFormType = z.infer<typeof TaskSchema>;