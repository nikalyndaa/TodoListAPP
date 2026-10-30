import React, { useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, ActivityIndicator } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ITask, ILookup } from "@/types/tasks/ITask";
import { TaskFormType, TaskSchema } from "@/schemas/TaskSchema";

interface TaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormType) => Promise<void>;
  taskToEdit?: ITask | null;
  statuses: ILookup[];
  priorities: ILookup[];
  loading?: boolean;
}

export const TaskModal = ({
  visible,
  onClose,
  onSubmit,
  taskToEdit,
  statuses,
  priorities,
  loading,
}: TaskModalProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormType>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      statusId: statuses[0]?.id || 1,
      priorityId: priorities[0]?.id || 1,
    },
  });

  useEffect(() => {
    if (taskToEdit) {
      reset({
        title: taskToEdit.title,
        description: taskToEdit.description || "",
        dueDate: taskToEdit.dueDate || "",
        statusId: taskToEdit.statusId,
        priorityId: taskToEdit.priorityId,
      });
    } else {
      reset({
        title: "",
        description: "",
        dueDate: "",
        statusId: statuses[0]?.id || 1,
        priorityId: priorities[0]?.id || 1,
      });
    }
  }, [taskToEdit, visible, statuses, priorities, reset]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl p-6 max-h-[90%] shadow-xl">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-900">
              {taskToEdit ? "Редагувати завдання" : "Нове завдання"}
            </Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <Text className="text-gray-500 font-semibold text-base">✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="space-y-4">
            {/* Title */}
            <View className="mb-3">
              <Text className="text-sm font-medium text-gray-700 mb-1">Назва *</Text>
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-base"
                    placeholder="Введіть назву завдання"
                    placeholderTextColor="#9CA3AF"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.title && (
                <Text className="text-red-500 text-xs mt-1">{errors.title.message}</Text>
              )}
            </View>

            {/* Description */}
            <View className="mb-3">
              <Text className="text-sm font-medium text-gray-700 mb-1">Опис</Text>
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-base h-24 text-top"
                    placeholder="Деталі завдання (опціонально)"
                    placeholderTextColor="#9CA3AF"
                    multiline
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value || ""}
                  />
                )}
              />
              {errors.description && (
                <Text className="text-red-500 text-xs mt-1">{errors.description.message}</Text>
              )}
            </View>

            {/* Due Date */}
            <View className="mb-3">
              <Text className="text-sm font-medium text-gray-700 mb-1">Дедлайн (РРРР-ММ-ДД)</Text>
              <Controller
                control={control}
                name="dueDate"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-base"
                    placeholder="2026-12-31"
                    placeholderTextColor="#9CA3AF"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value || ""}
                  />
                )}
              />
              {errors.dueDate && (
                <Text className="text-red-500 text-xs mt-1">{errors.dueDate.message}</Text>
              )}
            </View>

            {/* Status Selection */}
            <View className="mb-3">
              <Text className="text-sm font-medium text-gray-700 mb-1">Статус</Text>
              <Controller
                control={control}
                name="statusId"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row flex-wrap gap-2">
                    {statuses.map((status) => {
                      const isSelected = value === status.id;
                      return (
                        <TouchableOpacity
                          key={status.id}
                          onPress={() => onChange(status.id)}
                          className={`px-4 py-2 rounded-xl border ${
                            isSelected
                              ? "bg-blue-600 border-blue-600"
                              : "bg-gray-50 border-gray-300"
                          }`}
                        >
                          <Text
                            className={`text-sm font-medium ${
                              isSelected ? "text-white" : "text-gray-700"
                            }`}
                          >
                            {status.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              />
            </View>

            {/* Priority Selection */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-1">Пріоритет</Text>
              <Controller
                control={control}
                name="priorityId"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row flex-wrap gap-2">
                    {priorities.map((priority) => {
                      const isSelected = value === priority.id;
                      return (
                        <TouchableOpacity
                          key={priority.id}
                          onPress={() => onChange(priority.id)}
                          className={`px-4 py-2 rounded-xl border ${
                            isSelected
                              ? "bg-amber-600 border-amber-600"
                              : "bg-gray-50 border-gray-300"
                          }`}
                        >
                          <Text
                            className={`text-sm font-medium ${
                              isSelected ? "text-white" : "text-gray-700"
                            }`}
                          >
                            {priority.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              />
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3 pt-2 pb-6">
              <TouchableOpacity
                onPress={onClose}
                className="flex-1 bg-gray-100 py-3.5 rounded-xl items-center"
              >
                <Text className="text-gray-700 font-semibold text-base">Скасувати</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                disabled={loading}
                className="flex-1 bg-blue-600 py-3.5 rounded-xl items-center justify-center shadow-md shadow-blue-200"
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-semibold text-base">Зберегти</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};