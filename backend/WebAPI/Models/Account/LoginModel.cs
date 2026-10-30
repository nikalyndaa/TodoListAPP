using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models.Account
{
    public class LoginModel
    {
        [Required(ErrorMessage = "Вкажіть електронну адресу")]
        [EmailAddress(ErrorMessage = "Некоректна електронна адреса")]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "Вкажіть пароль")]
        [MinLength(6, ErrorMessage = "Пароль має містити щонайменше 6 символів")]
        public string Password { get; set; } = null!;
    }
}
