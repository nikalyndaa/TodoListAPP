using Microsoft.AspNetCore.Identity;

namespace WebAPI.Data.Entities
{
    public class RoleEntity : IdentityRole<int>
    {
        public ICollection<UserRoleEntity>? UserRoles { get; set; }
    }
}
