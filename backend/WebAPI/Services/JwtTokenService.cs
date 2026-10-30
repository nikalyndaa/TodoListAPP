using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebAPI.Data.Entities;
using WebAPI.Interfaces;

namespace WebAPI.Services
{
    public class JwtTokenService(
        IConfiguration configuration,UserManager<UserEntity> userManager ):
        IJwtTokenService
    {
        public async Task<string> CreateTokenAsync(UserEntity user)
        {
            var key = configuration["Jwt:Key"];
            var claims = new List<Claim>
            {
                new Claim("email", user.Email),
                new Claim("image", user.Image ?? "noimage.jpg")
            };
            var roles = await userManager.GetRolesAsync(user);
            foreach(var role in roles)
            {
                claims.Add(new Claim("roles", role));
            }
            var keyBytes = Encoding.UTF8.GetBytes(key);
            // create new key
            var symmetricSecurityKey = new SymmetricSecurityKey(keyBytes);
            // вказуємо алгоритм шифрування та ключ
            var signingCredentials = new SigningCredentials(symmetricSecurityKey,
                SecurityAlgorithms.HmacSha256);

            // робимо такен і вказуєсо його налаштування
            var jwtSecurityToken = new JwtSecurityToken(
                claims:claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: signingCredentials);
            
            var token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);
            return token.ToString();
            throw new NotImplementedException();
        }
    }
}
