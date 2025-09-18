using System;
using System.Collections.Generic;

namespace API.Entities;

public partial class Booking
{
    public int BookingId { get; set; }

    public int CustomerId { get; set; }

    public int RoomTypeId { get; set; }

    public int? RoomId { get; set; }

    public DateOnly CheckInDate { get; set; }

    public DateOnly CheckOutDate { get; set; }

    public string? Status { get; set; }

    public decimal? TotalPrice { get; set; }

    public string? PaymentMethod { get; set; }

    public virtual ICollection<BookingService> BookingServices { get; set; } = new List<BookingService>();

    public virtual Customer Customer { get; set; } = null!;

    public virtual Room? Room { get; set; }

    public virtual RoomType RoomType { get; set; } = null!;
}
