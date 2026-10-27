using System.ComponentModel.DataAnnotations;

namespace RealEstate.Api.Models;

public class Property
{
    public int Id { get; set; }
    [MaxLength(200)] public string Title { get; set; } = "";
    [MaxLength(4000)] public string Description { get; set; } = "";
    public PropertyType PropertyType { get; set; }
    public ListingType ListingType { get; set; }
    public decimal Price { get; set; }
    public int Bedrooms { get; set; }
    public int Bathrooms { get; set; }
    /// <summary>Usable/land area in square metres.</summary>
    public decimal Area { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    [MaxLength(300)] public string Address { get; set; } = "";
    [MaxLength(100)] public string Province { get; set; } = "";
    [MaxLength(100)] public string District { get; set; } = "";
    public PropertyStatus Status { get; set; } = PropertyStatus.Active;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    /// <summary>True for seeded sample listings (not real properties).</summary>
    public bool IsDemo { get; set; }
    public int? AgentId { get; set; }
    public Agent? Agent { get; set; }
    public List<PropertyImage> Images { get; set; } = new();
}

public class PropertyImage
{
    public int Id { get; set; }
    public int PropertyId { get; set; }
    public Property? Property { get; set; }
    [MaxLength(1000)] public string ImageUrl { get; set; } = "";
    public int SortOrder { get; set; }
}

public class Agent
{
    public int Id { get; set; }
    [MaxLength(150)] public string Name { get; set; } = "";
    [MaxLength(30)] public string? Phone { get; set; }
    [MaxLength(200)] public string? Email { get; set; }
    [MaxLength(100)] public string? LineId { get; set; }
}

/// <summary>Reserved for the membership system (next phase).</summary>
public class User
{
    public int Id { get; set; }
    [MaxLength(200)] public string Email { get; set; } = "";
    [MaxLength(150)] public string DisplayName { get; set; } = "";
    [MaxLength(500)] public string PasswordHash { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
