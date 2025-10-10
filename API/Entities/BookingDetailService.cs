using System;
using System.Collections.Generic;

namespace API.Entities;

public partial class BookingDetailService
{
    public int BookingDetailServiceId { get; set; }

    public int BookingDetailId { get; set; }

    public int ServiceId { get; set; }

    public int? Quantity { get; set; }

    public decimal? Price { get; set; }

    public virtual BookingDetail BookingDetail { get; set; } = null!;

    public virtual Service Service { get; set; } = null!;
}
