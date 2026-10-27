using System.ComponentModel.DataAnnotations;
using RealEstate.Api.Models;

namespace RealEstate.Api.Dtos;

public record AgentDto(int Id, string Name, string? Phone, string? Email, string? LineId);

public record PropertyListItemDto(
    int Id, string Title, string PropertyType, string ListingType, decimal Price, int Bedrooms, int Bathrooms,
    decimal Area, double Latitude, double Longitude, string Address, string Province, string District,
    string? CoverImage, DateTime CreatedAt, bool IsDemo);

public record PropertyDetailDto(
    int Id, string Title, string Description, string PropertyType, string ListingType, decimal Price, int Bedrooms,
    int Bathrooms, decimal Area, double Latitude, double Longitude, string Address, string Province, string District,
    string Status, DateTime CreatedAt, bool IsDemo, IReadOnlyList<string> Images, AgentDto? Agent);

public record PagedResult<T>(IReadOnlyList<T> Items, int Total, int Page, int PageSize);

public enum PropertySort { Relevance, PriceAsc, PriceDesc, Newest }

public class PropertyQuery
{
    public ListingType? ListingType { get; set; }
    public PropertyType? PropertyType { get; set; }
    [Range(0, double.MaxValue)] public decimal? MinPrice { get; set; }
    [Range(0, double.MaxValue)] public decimal? MaxPrice { get; set; }
    [Range(0, 50)] public int? Bedrooms { get; set; }
    [Range(0, 50)] public int? Bathrooms { get; set; }
    [MaxLength(100)] public string? Province { get; set; }
    [MaxLength(100)] public string? District { get; set; }
    /// <summary>Free text matched against title, address, district and province.</summary>
    [MaxLength(100)] public string? Q { get; set; }
    public PropertySort Sort { get; set; } = PropertySort.Relevance;
    [Range(1, int.MaxValue)] public int Page { get; set; } = 1;
    [Range(1, 100)] public int PageSize { get; set; } = 12;
}

public class MapQuery : PropertyQuery
{
    [Range(-180, 180)] public double West { get; set; }
    [Range(-90, 90)] public double South { get; set; }
    [Range(-180, 180)] public double East { get; set; }
    [Range(-90, 90)] public double North { get; set; }
    /// <summary>Max markers returned for a viewport.</summary>
    [Range(1, 1000)] public int Limit { get; set; } = 500;
}
