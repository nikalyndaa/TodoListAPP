namespace WebAPI.Models.Tasks
{
    public class TaskModel
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? CompletedAt { get; set; }
        public int StatusId { get; set; }
        public string Status { get; set; } = string.Empty;
        public int PriorityId { get; set; }
        public string Priority { get; set; } = string.Empty;
    }
}
