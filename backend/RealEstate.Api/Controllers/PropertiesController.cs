using Microsoft.AspNetCore.Mvc;
using RealEstate.Api.Dtos;
using RealEstate.Api.Services;

namespace RealEstate.Api.Controllers;

[ApiController]
[Route("api/properties")]
public class PropertiesController(IPropertyService service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PagedResult<PropertyListItemDto>>> Search([FromQuery] PropertyQuery q, CancellationToken ct)
    {
        if (!PriceRangeOk(q)) return PriceProblem();
        return await service.SearchAsync(q, ct);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<PropertyDetailDto>> Get(int id, CancellationToken ct) =>
        await service.GetAsync(id, ct) is { } p ? p : NotFound();

    [HttpGet("map")]
    public async Task<ActionResult<IReadOnlyList<PropertyListItemDto>>> Map([FromQuery] MapQuery q, CancellationToken ct)
    {
        if (!PriceRangeOk(q)) return PriceProblem();
        var given = Request.Query.Keys.Select(k => k.ToLowerInvariant()).ToHashSet();
        if (!new[] { "west", "south", "east", "north" }.All(given.Contains))
        {
            ModelState.AddModelError("bounds", "west, south, east and north are all required.");
            return ValidationProblem();
        }
        if (q.South > q.North)
        {
            ModelState.AddModelError("south", "south must be less than or equal to north.");
            return ValidationProblem();
        }
        return Ok(await service.MapAsync(q, ct));
    }

    [HttpGet("featured")]
    public async Task<ActionResult<IReadOnlyList<PropertyListItemDto>>> Featured([FromQuery] int count = 6, CancellationToken ct = default) =>
        Ok(await service.FeaturedAsync(Math.Clamp(count, 1, 24), ct));

    [HttpGet("{id:int}/nearby")]
    public async Task<ActionResult<IReadOnlyList<PropertyListItemDto>>> Nearby(int id, [FromQuery] int count = 4, CancellationToken ct = default) =>
        Ok(await service.NearbyAsync(id, Math.Clamp(count, 1, 12), ct));

    private static bool PriceRangeOk(PropertyQuery q) => q.MinPrice is null || q.MaxPrice is null || q.MinPrice <= q.MaxPrice;

    private ActionResult PriceProblem()
    {
        ModelState.AddModelError("price", "minPrice must be less than or equal to maxPrice.");
        return ValidationProblem();
    }
}
