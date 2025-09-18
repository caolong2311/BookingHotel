using System;
using System.Collections.Generic;

namespace API.Entities;

public partial class Room
{
    public int RoomId { get; set; }

    public string RoomNumber { get; set; } = null!;

    public int RoomTypeId { get; set; }

    public string? Status { get; set; }

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    public virtual RoomType RoomType { get; set; } = null!;
}
