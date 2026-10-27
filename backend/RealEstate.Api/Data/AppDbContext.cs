using Microsoft.EntityFrameworkCore;
using RealEstate.Api.Models;

namespace RealEstate.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Property> Properties => Set<Property>();
    public DbSet<PropertyImage> PropertyImages => Set<PropertyImage>();
    public DbSet<Agent> Agents => Set<Agent>();
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<Property>(e =>
        {
            e.Property(p => p.Price).HasPrecision(18, 2);
            e.Property(p => p.Area).HasPrecision(12, 2);
            e.Property(p => p.PropertyType).HasConversion<string>().HasMaxLength(20);
            e.Property(p => p.ListingType).HasConversion<string>().HasMaxLength(10);
            e.Property(p => p.Status).HasConversion<string>().HasMaxLength(10);
            e.HasIndex(p => new { p.Latitude, p.Longitude });
            e.HasIndex(p => new { p.Status, p.ListingType, p.PropertyType });
            e.HasOne(p => p.Agent).WithMany().HasForeignKey(p => p.AgentId).OnDelete(DeleteBehavior.SetNull);
            e.HasMany(p => p.Images).WithOne(i => i.Property).HasForeignKey(i => i.PropertyId).OnDelete(DeleteBehavior.Cascade);
        });
        b.Entity<User>().HasIndex(u => u.Email).IsUnique();

        SeedData.Apply(b);
    }
}
