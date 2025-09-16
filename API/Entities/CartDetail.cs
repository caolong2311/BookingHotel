using System;
using System.Collections.Generic;

namespace API.Entities;

public partial class CartDetail
{
    public int Id { get; set; }

    public int ShoppingCartId { get; set; }

    public int BookId { get; set; }

    public int Quantity { get; set; }

    public double UnitPrice { get; set; }

    public virtual Book Book { get; set; } = null!;

    public virtual ShoppingCart ShoppingCart { get; set; } = null!;
}
