using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace WebAPI.Data.Entities
{

    [Table("tbl_task_statuses")]
    [Index(nameof(Name), IsUnique = true)]
    public class TaskStatusEntity
    {
        /// <summary>Унікальний ідентифікатор статусу.</summary>
        [Key]
        public int Id { get; set; }

        /// <summary>Назва статусу (унікальна).</summary>
        [Required, StringLength(50)]
        public string Name { get; set; } = string.Empty;

        /// <summary>Задачі, що мають цей статус.</summary>
        public ICollection<TaskEntity>? Tasks { get; set; }
    }

}
