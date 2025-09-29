using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace API.Entities;

public partial class RoomType
{
    public int RoomTypeId { get; set; }

    public string TypeName { get; set; } = null!;

    public int TotalRooms { get; set; }

    public decimal BasePrice { get; set; }

    public string? BedDescription { get; set; }

    public int MaxOccupancy { get; set; }

    public int Area { get; set; }

    public string? Description { get; set; }

    public string? Image { get; set; }
    [JsonIgnore]
    public virtual ICollection<BookingDetail> BookingDetails { get; set; } = new List<BookingDetail>();
    [JsonIgnore]
    public virtual ICollection<Room> Rooms { get; set; } = new List<Room>();
}
