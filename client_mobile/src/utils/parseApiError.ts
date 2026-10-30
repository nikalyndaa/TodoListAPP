import axios from "axios";

export type ParsedApiError = {
  general?: string;
  fields: Record<string, string>;
};

const lowerFirst = (s: string) => (s ? s[0].toLowerCase() + s.slice(1) : s);

export function parseApiError(e: unknown): ParsedApiError {
  const result: ParsedApiError = { fields: {} };

  if (!axios.isAxiosError(e)) {
    result.general = "Сталася невідома помилка";
    return result;
  }

  // Відповіді від сервера немає
  if (!e.response) {
    result.general =
      e.code === "ECONNABORTED"
        ? "Сервер не відповідає. Спробуйте пізніше."
        : "Немає з'єднання з сервером. Перевірте інтернет.";
    return result;
  }

  const { status, data } = e.response;

  if (status === 413) {
    result.general = "Фото занадто велике. Оберіть менше зображення.";
    return result;
  }

  if (typeof data === "string" && data.trim()) {
    result.general = data;
    return result;
  }

  // ValidationProblemDetails: { errors: { Email: ["..."] } }
  if (data?.errors && typeof data.errors === "object") {
    for (const [key, messages] of Object.entries<string[]>(data.errors)) {
      const text = Array.isArray(messages) ? messages.join(". ") : String(messages);
      if (!key) {
        result.general = result.general ? `${result.general}. ${text}` : text;
      } else {
        result.fields[lowerFirst(key)] = text;
      }
    }
    if (Object.keys(result.fields).length || result.general) return result;
  }

  result.general =
    data?.message ??
    data?.detail ??
    (status >= 500
      ? "Помилка сервера. Спробуйте пізніше."
      : data?.title ?? "Не вдалося зареєструватися");
  return result;
}