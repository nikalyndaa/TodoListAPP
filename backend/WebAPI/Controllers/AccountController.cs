using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WebAPI.Constants;
using WebAPI.Data.Entities;
using WebAPI.Interfaces;
using WebAPI.Models.Account;

namespace WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController(
    UserManager<UserEntity> userManager,
    IJwtTokenService jwtTokenService,
    IImageService imageService,
    ILogger<AccountController> logger) : ControllerBase
{
    private const long MaxImageSize = 10 * 1024 * 1024; // 10 МБ

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        try
        {
            var email = model.Email.Trim();
            var user = await userManager.FindByEmailAsync(email);
            const string invalidMessage = "Невірний email або пароль";
            if (user == null)
                return Unauthorized(new { message = invalidMessage });


            if (!await userManager.CheckPasswordAsync(user, model.Password))
            {
                return Unauthorized(new { message = invalidMessage });
            }

            var token = await jwtTokenService.CreateTokenAsync(user);
            return Ok(new { Token = token });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Помилка входу {Email}", model.Email);
            return Problem("Внутрішня помилка сервера. Спробуйте пізніше", statusCode: 500);
        }
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromForm] RegisterModel registerModel)
    {
        if (registerModel.Password != registerModel.ConfirmPassword)
            ModelState.AddModelError(nameof(registerModel.ConfirmPassword), "Паролі не збігаються");

        if (registerModel.ImageFile is { Length: > 0 } file)
        {
            if (file.ContentType is null || !file.ContentType.StartsWith("image/"))
                ModelState.AddModelError(nameof(registerModel.ImageFile), "Файл має бути зображенням");
            else if (file.Length > MaxImageSize)
                ModelState.AddModelError(nameof(registerModel.ImageFile), "Фото занадто велике (максимум 10 МБ)");
        }

        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        if (await userManager.FindByEmailAsync(registerModel.Email) != null)
        {
            ModelState.AddModelError(nameof(registerModel.Email), "Користувача з такою адресою уже створено");
            return ValidationProblem(ModelState);
        }

        string? imageName = null;
        UserEntity? user = null;
        try
        {
            if (registerModel.ImageFile is { Length: > 0 })
            {
                try
                {
                    imageName = await imageService.SaveOptimizedImageAsync(registerModel.ImageFile);
                }
                catch (Exception ex) when (ex is InvalidOperationException or ArgumentException)
                {
                    ModelState.AddModelError(nameof(registerModel.ImageFile), "Не вдалося обробити зображення");
                    return ValidationProblem(ModelState);
                }
            }

            user = new UserEntity
            {
                Email = registerModel.Email,
                UserName = registerModel.Email,
                FirstName = registerModel.FirstName,
                LastName = registerModel.LastName,
                Image = imageName
            };

            var result = await userManager.CreateAsync(user, registerModel.Password);
            if (!result.Succeeded)
            {
                await CleanupImageAsync(imageName);
                AddIdentityErrors(result.Errors);
                return ValidationProblem(ModelState);
            }

            var roleResult = await userManager.AddToRoleAsync(user, Roles.User);
            if (!roleResult.Succeeded)
            {
                await userManager.DeleteAsync(user);
                await CleanupImageAsync(imageName);
                logger.LogError("Не вдалося призначити роль: {Errors}",
                    string.Join("; ", roleResult.Errors.Select(e => e.Description)));
                return Problem("Не вдалося завершити реєстрацію", statusCode: 500);
            }

            var token = await jwtTokenService.CreateTokenAsync(user);
            return Ok(new { Token = token });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Помилка реєстрації {Email}", registerModel.Email);
            if (user?.Id > 0) await userManager.DeleteAsync(user);
            await CleanupImageAsync(imageName);
            return Problem("Внутрішня помилка сервера. Спробуйте пізніше", statusCode: 500);
        }
    }

    private void AddIdentityErrors(IEnumerable<IdentityError> errors)
    {
        foreach (var e in errors)
        {
            var key = e.Code switch
            {
                "DuplicateEmail" or "DuplicateUserName"
                    or "InvalidEmail" or "InvalidUserName" => nameof(RegisterModel.Email),
                var c when c.StartsWith("Password") => nameof(RegisterModel.Password),
                _ => ""
            };
            ModelState.AddModelError(key, e.Description);
        }
    }

    private async Task CleanupImageAsync(string? imageName)
    {
        if (string.IsNullOrEmpty(imageName)) return;
        try { await imageService.RemoveImageAsync(imageName); }
        catch (Exception ex) { logger.LogWarning(ex, "Не вдалося видалити {Image}", imageName); }
    }

    [Authorize]
    [HttpGet("profile")]
    public async Task<IActionResult> Profile()
    {
        var email = User.FindFirstValue(ClaimTypes.Email) ??
            User.FindFirstValue("email");
        if (string.IsNullOrEmpty(email))
            return Unauthorized(new { error = "Користувача не знайдено" });
        var user = await userManager.FindByEmailAsync(email);
        if (user == null)
            return NotFound(new { error = "КОристувач відсутній" });
        var roles = await userManager.GetRolesAsync(user);
        var model = new ProfileModel
        {
            Id = user.Id,
            Email = email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Image = user.Image ?? string.Empty,
            Roles = roles
        };
        return Ok(model);
    }


    [Authorize]
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        try
        {
            var users = await userManager.Users
                .OrderBy(u => u.Id)
                .Select(u => new UserListModel
                {
                    Id = u.Id,
                    Email = u.Email,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Image = u.Image,
                    Roles = u.UserRoles!.Select(u => u.Role!.Name!).ToList()
                }).ToListAsync();

            return Ok(users);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Невдалося підвантажити користувачів");
            return BadRequest(ex.Message);
        }
    }
}