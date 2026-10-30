using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace WebAPI.Data.Entities
{
    /// <summary>Задача користувача в таск-менеджері.</summary>
    [Table("tbl_tasks")]
    [Index(nameof(UserId), nameof(StatusId))]
    public class TaskEntity
    {
        /// <summary>Унікальний ідентифікатор задачі.</summary>
        [Key]
        public int Id { get; set; }

        /// <summary>Короткий заголовок задачі.</summary>
        [Required, StringLength(200)]
        public string Title { get; set; } = string.Empty;

        /// <summary>Детальний опис задачі (необов'язково).</summary>
        [StringLength(2000)]
        public string? Description { get; set; }

        /// <summary>Дата й час створення задачі (UTC).</summary>
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>Дата й час останнього редагування (UTC).</summary>
        public DateTime? UpdatedAt { get; set; }

        /// <summary>Дедлайн виконання задачі.</summary>
        public DateTime? DueDate { get; set; }

        /// <summary>Дата й час фактичного завершення задачі (UTC).</summary>
        public DateTime? CompletedAt { get; set; }

        /// <summary>Ознака м'якого видалення: true — задача видалена, але залишається в БД.</summary>
        public bool IsDeleted { get; set; } = false;

        /// <summary>Дата й час м'якого видалення (UTC).</summary>
        public DateTime? DeletedAt { get; set; }

        /// <summary>Зовнішній ключ на статус задачі.</summary>
        [Required]
        [ForeignKey(nameof(Status))]
        public int StatusId { get; set; }

        /// <summary>Поточний статус задачі.</summary>
        public TaskStatusEntity? Status { get; set; }

        /// <summary>Зовнішній ключ на пріоритет задачі.</summary>
        [Required]
        [ForeignKey(nameof(Priority))]
        public int PriorityId { get; set; }

        /// <summary>Пріоритет задачі.</summary>
        public TaskPriorityEntity? Priority { get; set; }

        /// <summary>Зовнішній ключ на користувача-власника задачі.</summary>
        [Required]
        [ForeignKey(nameof(User))]
        public int UserId { get; set; }

        /// <summary>Користувач, якому належить задача.</summary>
        public UserEntity? User { get; set; }
    }

}
