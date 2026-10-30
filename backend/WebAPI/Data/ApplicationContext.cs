using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WebAPI.Data.Entities;

public class ApplicationContext
    : IdentityDbContext<UserEntity, RoleEntity, int>
{
    public ApplicationContext(DbContextOptions<ApplicationContext> options)
        : base(options)
    {

    }

    public DbSet<TaskStatusEntity> TaskStatuses { get; set; }
    public DbSet<TaskPriorityEntity> TaskPriorities { get; set; }
    public DbSet<TaskEntity> Tasks { get; set; }    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<TaskEntity>().HasQueryFilter(t => !t.IsDeleted);
        //identity
        modelBuilder.Entity<UserRoleEntity>()
            .HasOne(ur => ur.User)
            .WithMany(u => u.UserRoles)
            .HasForeignKey(ur => ur.UserId);

        modelBuilder.Entity<UserRoleEntity>()
            .HasOne(ur => ur.Role)
            .WithMany(r => r.UserRoles)
            .HasForeignKey(ur => ur.RoleId);
    }
}
