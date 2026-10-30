using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models.Account
{
    public class RegisterModel
    {
        [Required(ErrorMessage ="Вкажіть ім'я")]
        [StringLength(100,ErrorMessage ="Ім'я задовге")]
        public string FirstName { get; set; } = null!;

        [Required(ErrorMessage = "Вкажіть прізвище")]
        [StringLength(100, ErrorMessage = "Прізвище занадто довге")]
        public string LastName { get; set; } = null!;

        [Required(ErrorMessage = "Вкажіть електронну адресу")]
        [EmailAddress(ErrorMessage = "Некоректна електронна адреса")]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "Вкажіть пароль")]
        [MinLength(6, ErrorMessage = "Пароль має містити щонайменше 6 символів")]
        public string Password { get; set; } = null!;

        [Required(ErrorMessage = "Повторіть пароль")]
        public string ConfirmPassword { get; set; } = null!;
        public IFormFile? ImageFile { get; set; }
    }
}
