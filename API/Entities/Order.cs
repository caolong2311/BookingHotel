using System;
using System.Collections.Generic;

namespace API.Entities;

public partial class Order
{
    public int Id { get; set; }

    public int? UserId { get; set; }

    public DateTime CreateDate { get; set; }

    public bool IsDeleted { get; set; }

    public string Name { get; set; } = null!;

    public string MobileNumber { get; set; } = null!;

    public string Address { get; set; } = null!;

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
}
