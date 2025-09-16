using System;
using System.Collections.Generic;

namespace API.Entities;

public partial class ShoppingCart
{
    public int Id { get; set; }

    public int? UserId { get; set; }

    public bool IsDeleted { get; set; }

    public virtual ICollection<CartDetail> CartDetails { get; set; } = new List<CartDetail>();
}
