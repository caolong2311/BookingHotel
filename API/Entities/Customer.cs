using System;
using System.Collections.Generic;

namespace API.Entities;

public partial class Customer
{
    public int CustomerId { get; set; }

    public string FullName { get; set; } = null!;

    public string? Email { get; set; }

    public string? PhoneNumber { get; set; }

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
