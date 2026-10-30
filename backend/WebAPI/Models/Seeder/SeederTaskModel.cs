namespace WebAPI.Models.Seeder
{
    public class SeederTaskModel
    {
        /// <summary>Email власника задачі (має збігатися з Email у Users.json).</summary>
        public string UserEmail { get; set; } = string.Empty;

        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        /// <summary>Назва статусу (До виконання, В процесі, Виконано, Скасовано).</summary>
        public string Status { get; set; } = string.Empty;

        /// <summary>Назва пріоритету (Низький, Середній, Високий, Терміновий).</summary>
        public string Priority { get; set; } = string.Empty;

        public DateTime? DueDate { get; set; }

        public DateTime? CompletedAt { get; set; }

        public bool IsDeleted { get; set; }

        public DateTime? DeletedAt { get; set; }
    }

}
