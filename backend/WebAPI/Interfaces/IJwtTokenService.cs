using WebAPI.Data.Entities;

namespace WebAPI.Interfaces
{
    public interface IJwtTokenService
    {
        Task<String> CreateTokenAsync(UserEntity user);
    }
}
