using System;
using System.Collections.Generic;

namespace API.Entities;

public partial class BookingDetail
{
    public int BookingDetailId { get; set; }

    public int BookingId { get; set; }

    public int RoomTypeId { get; set; }

    public string? RoomNumber { get; set; }

    public decimal Price { get; set; }

    public int Status { get; set; } = 0;

    public virtual Booking Booking { get; set; } = null!;

    public virtual ICollection<BookingDetailService> BookingDetailServices { get; set; } = new List<BookingDetailService>();

    public virtual Room? RoomNumberNavigation { get; set; }

    public virtual RoomType RoomType { get; set; } = null!;
}
