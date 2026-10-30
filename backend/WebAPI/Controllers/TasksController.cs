using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System.Security.Claims;
using WebAPI.Data.Entities;
using WebAPI.Models.Tasks;
using WebAPI.Data;
using WebAPI.Data.Entities;
using WebAPI.Models.Tasks;

namespace WebApiDotNet.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TasksController(
    ApplicationContext context,
    UserManager<UserEntity> userManager) : ControllerBase
{
    /// <summary>Назва статусу, який означає "задачу виконано" (має збігатися із seed).</summary>
    private const string DoneStatusName = "Виконано";

    // Проєкція сутності в модель відповіді
    private static readonly Expression<Func<TaskEntity, TaskModel>> ToModel = t => new TaskModel
    {
        Id = t.Id,
        Title = t.Title,
        Description = t.Description,
        CreatedAt = t.CreatedAt,
        UpdatedAt = t.UpdatedAt,
        DueDate = t.DueDate,
        CompletedAt = t.CompletedAt,
        StatusId = t.StatusId,
        Status = t.Status!.Name,
        PriorityId = t.PriorityId,
        Priority = t.Priority!.Name
    };

    /// <summary>Список задач поточного користувача з фільтрами.</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int? statusId,
        [FromQuery] int? priorityId,
        [FromQuery] string? search)
    {
        var userId = await GetCurrentUserIdAsync();
        if (userId == null)
            return Unauthorized(new { error = "Користувача не знайдено!" });

        var query = context.Tasks.AsNoTracking().Where(t => t.UserId == userId);

        if (statusId.HasValue)
            query = query.Where(t => t.StatusId == statusId);

        if (priorityId.HasValue)
            query = query.Where(t => t.PriorityId == priorityId);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(t =>
                t.Title.ToLower().Contains(term) ||
                (t.Description != null && t.Description.ToLower().Contains(term)));
        }

        var tasks = await query
            .OrderBy(t => t.DueDate == null)   // задачі без дедлайну в кінці
            .ThenBy(t => t.DueDate)
            .ThenByDescending(t => t.CreatedAt)
            .Select(ToModel)
            .ToListAsync();

        return Ok(tasks);
    }

    /// <summary>Отримати задачу за Id.</summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var userId = await GetCurrentUserIdAsync();
        if (userId == null)
            return Unauthorized(new { error = "Користувача не знайдено!" });

        var task = await context.Tasks.AsNoTracking()
            .Where(t => t.Id == id && t.UserId == userId)
            .Select(ToModel)
            .FirstOrDefaultAsync();

        return task == null
            ? NotFound(new { error = "Задачу не знайдено!" })
            : Ok(task);
    }

    /// <summary>Створити нову задачу.</summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] TaskCreateModel model)
    {
        var userId = await GetCurrentUserIdAsync();
        if (userId == null)
            return Unauthorized(new { error = "Користувача не знайдено!" });

        var status = await context.TaskStatuses.FindAsync(model.StatusId);
        if (status == null)
            return BadRequest(new { error = "Статус не існує!" });

        if (!await context.TaskPriorities.AnyAsync(p => p.Id == model.PriorityId))
            return BadRequest(new { error = "Пріоритет не існує!" });

        var entity = new TaskEntity
        {
            Title = model.Title.Trim(),
            Description = model.Description?.Trim(),
            DueDate = ToUtc(model.DueDate),
            PriorityId = model.PriorityId,
            UserId = userId.Value
        };
        SetStatus(entity, status);

        context.Tasks.Add(entity);
        await context.SaveChangesAsync();

        var created = await context.Tasks.AsNoTracking()
            .Where(t => t.Id == entity.Id)
            .Select(ToModel)
            .FirstAsync();

        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, created);
    }

    /// <summary>Повністю оновити задачу.</summary>
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] TaskUpdateModel model)
    {
        var userId = await GetCurrentUserIdAsync();
        if (userId == null)
            return Unauthorized(new { error = "Користувача не знайдено!" });

        var entity = await context.Tasks
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
        if (entity == null)
            return NotFound(new { error = "Задачу не знайдено!" });

        var status = await context.TaskStatuses.FindAsync(model.StatusId);
        if (status == null)
            return BadRequest(new { error = "Статус не існує!" });

        if (!await context.TaskPriorities.AnyAsync(p => p.Id == model.PriorityId))
            return BadRequest(new { error = "Пріоритет не існує!" });

        entity.Title = model.Title.Trim();
        entity.Description = model.Description?.Trim();
        entity.DueDate = ToUtc(model.DueDate);
        entity.PriorityId = model.PriorityId;
        entity.UpdatedAt = DateTime.UtcNow;
        SetStatus(entity, status);

        await context.SaveChangesAsync();

        var updated = await context.Tasks.AsNoTracking()
            .Where(t => t.Id == id)
            .Select(ToModel)
            .FirstAsync();

        return Ok(updated);
    }

    /// <summary>Змінити лише статус задачі.</summary>
    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> ChangeStatus(int id, [FromBody] TaskChangeStatusModel model)
    {
        var userId = await GetCurrentUserIdAsync();
        if (userId == null)
            return Unauthorized(new { error = "Користувача не знайдено!" });

        var entity = await context.Tasks
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
        if (entity == null)
            return NotFound(new { error = "Задачу не знайдено!" });

        var status = await context.TaskStatuses.FindAsync(model.StatusId);
        if (status == null)
            return BadRequest(new { error = "Статус не існує!" });

        entity.UpdatedAt = DateTime.UtcNow;
        SetStatus(entity, status);

        await context.SaveChangesAsync();

        var updated = await context.Tasks.AsNoTracking()
            .Where(t => t.Id == id)
            .Select(ToModel)
            .FirstAsync();

        return Ok(updated);
    }

    /// <summary>М'яке видалення задачі (soft delete).</summary>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = await GetCurrentUserIdAsync();
        if (userId == null)
            return Unauthorized(new { error = "Користувача не знайдено!" });

        var entity = await context.Tasks
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
        if (entity == null)
            return NotFound(new { error = "Задачу не знайдено!" });

        entity.IsDeleted = true;
        entity.DeletedAt = DateTime.UtcNow;
        await context.SaveChangesAsync();

        return NoContent();
    }

    /// <summary>Довідник статусів.</summary>
    [HttpGet("statuses")]
    public async Task<IActionResult> GetStatuses()
    {
        var statuses = await context.TaskStatuses.AsNoTracking()
            .OrderBy(s => s.Id)
            .Select(s => new LookupModel { Id = s.Id, Name = s.Name })
            .ToListAsync();
        return Ok(statuses);
    }

    /// <summary>Довідник пріоритетів.</summary>
    [HttpGet("priorities")]
    public async Task<IActionResult> GetPriorities()
    {
        var priorities = await context.TaskPriorities.AsNoTracking()
            .OrderBy(p => p.Id)
            .Select(p => new LookupModel { Id = p.Id, Name = p.Name })
            .ToListAsync();
        return Ok(priorities);
    }

    // ---------- Допоміжні методи ----------

    /// <summary>Id поточного користувача за email з токена (так само, як у Profile).</summary>
    private async Task<int?> GetCurrentUserIdAsync()
    {
        var email = User.FindFirstValue(ClaimTypes.Email)
            ?? User.FindFirstValue("email");
        if (string.IsNullOrEmpty(email))
            return null;

        var user = await userManager.FindByEmailAsync(email);
        return user?.Id;
    }

    /// <summary>Встановлює статус і керує датою завершення.</summary>
    private static void SetStatus(TaskEntity task, TaskStatusEntity status)
    {
        task.StatusId = status.Id;
        task.CompletedAt = status.Name == DoneStatusName
            ? task.CompletedAt ?? DateTime.UtcNow
            : null;
    }

    /// <summary>Приводить дату до UTC (потрібно для PostgreSQL).</summary>
    private static DateTime? ToUtc(DateTime? date) => date switch
    {
        null => null,
        { Kind: DateTimeKind.Unspecified } d => DateTime.SpecifyKind(d, DateTimeKind.Utc),
        { } d => d.ToUniversalTime()
    };
}