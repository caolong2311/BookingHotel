using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace API.Entities;

public partial class Service
{
    public int ServiceId { get; set; }

    public string ServiceName { get; set; } = null!;

    public int Price { get; set; }

    public string ServiceType { get; set; } = null!;

    public string? Status { get; set; }
    [JsonIgnore]
    public virtual ICollection<BookingDetailService> BookingDetailServices { get; set; } = new List<BookingDetailService>();
}
