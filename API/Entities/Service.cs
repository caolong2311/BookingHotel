using System;
using System.Collections.Generic;

namespace API.Entities;

public partial class Service
{
    public int ServiceId { get; set; }

    public string ServiceName { get; set; } = null!;

    public int Price { get; set; }

    public string ServiceType { get; set; } = null!;

    public string? Status { get; set; }

    public virtual ICollection<BookingService> BookingServices { get; set; } = new List<BookingService>();
}
