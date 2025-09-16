using System;
using System.Collections.Generic;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public partial class HotelContext : DbContext
{
    public HotelContext()
    {
    }

    public HotelContext(DbContextOptions<HotelContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Book> Books { get; set; }

    public virtual DbSet<CartDetail> CartDetails { get; set; }

    public virtual DbSet<Genre> Genres { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<OrderDetail> OrderDetails { get; set; }

    public virtual DbSet<ShoppingCart> ShoppingCarts { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=ConnectionStrings:DefaultConnection");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Book>(entity =>
        {
            entity.ToTable("Book");

            entity.HasIndex(e => e.GenreId, "IX_Book_GenreId");

            entity.Property(e => e.AuthorName).HasMaxLength(40);
            entity.Property(e => e.BookName).HasMaxLength(40);
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Genre).WithMany(p => p.Books).HasForeignKey(d => d.GenreId);
        });

        modelBuilder.Entity<CartDetail>(entity =>
        {
            entity.ToTable("CartDetail");

            entity.HasIndex(e => e.BookId, "IX_CartDetail_BookId");

            entity.HasIndex(e => e.ShoppingCartId, "IX_CartDetail_ShoppingCartId");

            entity.HasOne(d => d.Book).WithMany(p => p.CartDetails).HasForeignKey(d => d.BookId);

            entity.HasOne(d => d.ShoppingCart).WithMany(p => p.CartDetails).HasForeignKey(d => d.ShoppingCartId);
        });

        modelBuilder.Entity<Genre>(entity =>
        {
            entity.ToTable("Genre");

            entity.Property(e => e.GenreName).HasMaxLength(40);
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.ToTable("Order");

            entity.Property(e => e.Address).HasMaxLength(200);
            entity.Property(e => e.Name).HasMaxLength(30);
        });

        modelBuilder.Entity<OrderDetail>(entity =>
        {
            entity.ToTable("OrderDetail");

            entity.HasIndex(e => e.BookId, "IX_OrderDetail_BookId");

            entity.HasIndex(e => e.OrderId, "IX_OrderDetail_OrderId");

            entity.HasOne(d => d.Book).WithMany(p => p.OrderDetails).HasForeignKey(d => d.BookId);

            entity.HasOne(d => d.Order).WithMany(p => p.OrderDetails).HasForeignKey(d => d.OrderId);
        });

        modelBuilder.Entity<ShoppingCart>(entity =>
        {
            entity.ToTable("ShoppingCart");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Users__3214EC07D5154430");

            entity.HasIndex(e => e.Username, "UQ__Users__536C85E4B8383E0C").IsUnique();

            entity.Property(e => e.FullName).HasMaxLength(50);
            entity.Property(e => e.Password).HasMaxLength(100);
            entity.Property(e => e.Role)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Username).HasMaxLength(50);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
