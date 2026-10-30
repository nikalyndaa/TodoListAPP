using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models.Tasks
{
    /// <summary>Дані для створення задачі.</summary>
    public class TaskCreateModel
    {
        [Required(ErrorMessage = "Назва задачі обов'язкова")]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [StringLength(2000)]
        public string? Description { get; set; }

        public DateTime? DueDate { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Вкажіть статус")]
        public int StatusId { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Вкажіть пріоритет")]
        public int PriorityId { get; set; }
    }
}
