using Microsoft.AspNetCore.Identity;
using System.Text.Json;
using System.Text;
using WebAPI.Constants;
using WebAPI.Data.Entities;
using WebAPI.Models.Seeder;
using Microsoft.EntityFrameworkCore;
using WebAPI.Interfaces;

namespace WebAPI.Extensions
{
    public static class DbSeeder
    {
        // Початкові значення довідників
        private static readonly string[] TaskStatuses = ["До виконання", "В процесі", "Виконано", "Скасовано"];
        private static readonly string[] TaskPriorities = ["Низький", "Середній", "Високий", "Терміновий"];
        public static async Task SeedData(this WebApplication webApplication)
        {
            using var scope = webApplication.Services.CreateScope();
            //Цей об'єкт буде верта посилання на конткетс, який зараєстрвоано в Progran.cs
            var context = scope.ServiceProvider.GetRequiredService<ApplicationContext>();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<RoleEntity>>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<UserEntity>>();
            var imageService = scope.ServiceProvider.GetRequiredService<IImageService>();

            context.Database.Migrate();

            if (!context.Roles.Any())
            {
                foreach (var roleName in Roles.ListRoles())
                {
                    await roleManager.CreateAsync(new RoleEntity { Name = roleName });
                }
            }

            if (!context.Users.Any())
            {
                var curDir = Directory.GetCurrentDirectory();
                var jsonFile = Path.Combine(curDir, "Helpers", "JsonData", "Users.json");
                if (File.Exists(jsonFile))
                {
                    var jsonData = await File.ReadAllTextAsync(jsonFile, encoding: Encoding.UTF8);
                    try
                    {
                        var users = JsonSerializer.Deserialize<List<SeederUserModel>>(jsonData);
                        foreach (var user in users)
                        {
                            var entity = new UserEntity
                            {
                                FirstName = user.FirstName,
                                LastName = user.LastName,
                                Email = user.Email,
                                UserName = user.Email,
                            };
                            if (!string.IsNullOrEmpty(user.Image))
                                entity.Image = await imageService.SaveImageFromUrlAsync(user.Image);
                            var result = await userManager.CreateAsync(entity, user.Password);
                            if (result.Succeeded)
                            {
                                foreach (var role in user.Roles)
                                {
                                    await userManager.AddToRoleAsync(entity, role);
                                }

                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("Викникла помилка при Seed Users ", ex.Message);
                    }
                }
            }
            // Довідник статусів
            if (!await context.TaskStatuses.AnyAsync())
            {
                context.TaskStatuses.AddRange(
                    TaskStatuses.Select(name => new TaskStatusEntity { Name = name }));
                await context.SaveChangesAsync();
            }

            // Довідник пріоритетів
            if (!await context.TaskPriorities.AnyAsync())
            {
                context.TaskPriorities.AddRange(
                    TaskPriorities.Select(name => new TaskPriorityEntity { Name = name }));
                await context.SaveChangesAsync();
            }

            // Задачі (IgnoreQueryFilters, щоб м'яко видалені задачі теж враховувались)
            if (!await context.Tasks.IgnoreQueryFilters().AnyAsync())
            {
                var jsonFile = Path.Combine(
                    Directory.GetCurrentDirectory(), "Helpers", "JsonData", "Tasks.json");
                if (File.Exists(jsonFile))
                {
                    try
                    {
                        var jsonData = await File.ReadAllTextAsync(jsonFile, Encoding.UTF8);
                        var tasks = JsonSerializer.Deserialize<List<SeederTaskModel>>(jsonData);

                        // Словники для швидкого пошуку Id за назвою / email
                        var statuses = await context.TaskStatuses
                            .ToDictionaryAsync(s => s.Name, s => s.Id);
                        var priorities = await context.TaskPriorities
                            .ToDictionaryAsync(p => p.Name, p => p.Id);
                        var usersByEmail = await context.Users
                            .Where(u => u.Email != null)
                            .ToDictionaryAsync(u => u.Email!, u => u.Id);

                        foreach (var task in tasks ?? [])
                        {
                            if (!usersByEmail.TryGetValue(task.UserEmail, out var userId) ||
                                !statuses.TryGetValue(task.Status, out var statusId) ||
                                !priorities.TryGetValue(task.Priority, out var priorityId))
                            {
                                Console.WriteLine($"Пропущено задачу '{task.Title}': не знайдено користувача, статус або пріоритет.");
                                continue;
                            }

                            context.Tasks.Add(new TaskEntity
                            {
                                Title = task.Title,
                                Description = task.Description,
                                DueDate = task.DueDate,
                                CompletedAt = task.CompletedAt,
                                IsDeleted = task.IsDeleted,
                                DeletedAt = task.DeletedAt,
                                UserId = userId,
                                StatusId = statusId,
                                PriorityId = priorityId
                            });
                        }

                        await context.SaveChangesAsync();
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Виникла помилка при Seed Tasks: {ex.Message}");
                    }
                }
            }
        }

    }
}
