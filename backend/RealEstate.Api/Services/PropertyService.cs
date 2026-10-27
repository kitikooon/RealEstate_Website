using Microsoft.EntityFrameworkCore;
using RealEstate.Api.Data;
using RealEstate.Api.Dtos;
using RealEstate.Api.Models;

namespace RealEstate.Api.Services;

public interface IPropertyService
{
    Task<PagedResult<PropertyListItemDto>> SearchAsync(PropertyQuery q, CancellationToken ct);
    Task<PropertyDetailDto?> GetAsync(int id, CancellationToken ct);
    Task<IReadOnlyList<PropertyListItemDto>> MapAsync(MapQuery q, CancellationToken ct);
    Task<IReadOnlyList<PropertyListItemDto>> FeaturedAsync(int count, CancellationToken ct);
    Task<IReadOnlyList<PropertyListItemDto>> NearbyAsync(int id, int count, CancellationToken ct);
}

public class PropertyService(AppDbContext db) : IPropertyService
{
    private IQueryable<Property> Active() => db.Properties.AsNoTracking().Where(p => p.Status == PropertyStatus.Active);

    private static IQueryable<Property> Filter(IQueryable<Property> src, PropertyQuery q)
    {
        if (q.ListingType is { } lt) src = src.Where(p => p.ListingType == lt);
        if (q.PropertyType is { } pt) src = src.Where(p => p.PropertyType == pt);
        if (q.MinPrice is { } min) src = src.Where(p => p.Price >= min);
        if (q.MaxPrice is { } max) src = src.Where(p => p.Price <= max);
        if (q.Bedrooms is { } bd) src = src.Where(p => p.Bedrooms >= bd);
        if (q.Bathrooms is { } ba) src = src.Where(p => p.Bathrooms >= ba);
        if (!string.IsNullOrWhiteSpace(q.Province)) src = src.Where(p => p.Province == q.Province);
        if (!string.IsNullOrWhiteSpace(q.District)) src = src.Where(p => p.District == q.District);
        if (!string.IsNullOrWhiteSpace(q.Q))
        {
            var pattern = $"%{Escape(q.Q.Trim())}%";
            src = src.Where(p => EF.Functions.Like(p.Title, pattern, "\\")
                || EF.Functions.Like(p.Address, pattern, "\\")
                || EF.Functions.Like(p.District, pattern, "\\")
                || EF.Functions.Like(p.Province, pattern, "\\"));
        }
        return src;
    }

    private static string Escape(string s) => s.Replace("\\", "\\\\").Replace("%", "\\%").Replace("_", "\\_").Replace("[", "\\[");

    private static IQueryable<Property> Sort(IQueryable<Property> src, PropertySort sort) => sort switch
    {
        PropertySort.PriceAsc => src.OrderBy(p => p.Price).ThenBy(p => p.Id),
        PropertySort.PriceDesc => src.OrderByDescending(p => p.Price).ThenBy(p => p.Id),
        // Relevance has no scoring yet, so it falls back to newest first, same as Newest.
        _ => src.OrderByDescending(p => p.CreatedAt).ThenBy(p => p.Id),
    };

    private static IQueryable<PropertyListItemDto> Project(IQueryable<Property> src) => src.Select(p => new PropertyListItemDto(
        p.Id, p.Title, p.PropertyType.ToString(), p.ListingType.ToString(), p.Price, p.Bedrooms, p.Bathrooms, p.Area,
        p.Latitude, p.Longitude, p.Address, p.Province, p.District,
        p.Images.OrderBy(i => i.SortOrder).Select(i => i.ImageUrl).FirstOrDefault(), p.CreatedAt, p.IsDemo));

    public async Task<PagedResult<PropertyListItemDto>> SearchAsync(PropertyQuery q, CancellationToken ct)
    {
        var filtered = Filter(Active(), q);
        var total = await filtered.CountAsync(ct);
        var items = await Project(Sort(filtered, q.Sort)).Skip((q.Page - 1) * q.PageSize).Take(q.PageSize).ToListAsync(ct);
        return new(items, total, q.Page, q.PageSize);
    }

    public async Task<PropertyDetailDto?> GetAsync(int id, CancellationToken ct)
    {
        var p = await Active().Include(x => x.Agent).Include(x => x.Images).FirstOrDefaultAsync(x => x.Id == id, ct);
        if (p is null) return null;
        return new(p.Id, p.Title, p.Description, p.PropertyType.ToString(), p.ListingType.ToString(), p.Price, p.Bedrooms,
            p.Bathrooms, p.Area, p.Latitude, p.Longitude, p.Address, p.Province, p.District, p.Status.ToString(), p.CreatedAt,
            p.IsDemo, p.Images.OrderBy(i => i.SortOrder).Select(i => i.ImageUrl).ToList(),
            p.Agent is null ? null : new AgentDto(p.Agent.Id, p.Agent.Name, p.Agent.Phone, p.Agent.Email, p.Agent.LineId));
    }

    public async Task<IReadOnlyList<PropertyListItemDto>> MapAsync(MapQuery q, CancellationToken ct)
    {
        var src = Filter(Active(), q).Where(p => p.Latitude >= q.South && p.Latitude <= q.North);
        // A viewport crossing the antimeridian has West > East.
        src = q.West <= q.East
            ? src.Where(p => p.Longitude >= q.West && p.Longitude <= q.East)
            : src.Where(p => p.Longitude >= q.West || p.Longitude <= q.East);
        return await Project(Sort(src, q.Sort)).Take(q.Limit).ToListAsync(ct);
    }

    public async Task<IReadOnlyList<PropertyListItemDto>> FeaturedAsync(int count, CancellationToken ct) =>
        await Project(Active().OrderByDescending(p => p.CreatedAt).ThenBy(p => p.Id)).Take(count).ToListAsync(ct);

    public async Task<IReadOnlyList<PropertyListItemDto>> NearbyAsync(int id, int count, CancellationToken ct)
    {
        var origin = await Active().Where(p => p.Id == id).Select(p => new { p.Latitude, p.Longitude }).FirstOrDefaultAsync(ct);
        if (origin is null) return [];
        // Planar distance is accurate enough for ranking nearby listings.
        var lat = origin.Latitude;
        var lng = origin.Longitude;
        return await Project(Active().Where(p => p.Id != id)
            .OrderBy(p => (p.Latitude - lat) * (p.Latitude - lat) + (p.Longitude - lng) * (p.Longitude - lng)))
            .Take(count).ToListAsync(ct);
    }
}
