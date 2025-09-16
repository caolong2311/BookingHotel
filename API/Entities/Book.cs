using System;
using System.Collections.Generic;

namespace API.Entities;

public partial class Book
{
    public int Id { get; set; }

    public string BookName { get; set; } = null!;

    public string AuthorName { get; set; } = null!;

    public double Price { get; set; }

    public string? Image { get; set; }

    public int GenreId { get; set; }

    public bool? IsDeleted { get; set; }

    public virtual ICollection<CartDetail> CartDetails { get; set; } = new List<CartDetail>();

    public virtual Genre Genre { get; set; } = null!;

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
}
