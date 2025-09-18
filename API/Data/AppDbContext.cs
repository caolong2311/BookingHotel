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

    public virtual DbSet<Booking> Bookings { get; set; }

    public virtual DbSet<BookingService> BookingServices { get; set; }

    public virtual DbSet<Customer> Customers { get; set; }

    public virtual DbSet<Room> Rooms { get; set; }

    public virtual DbSet<RoomType> RoomTypes { get; set; }

    public virtual DbSet<Service> Services { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=ConnectionStrings:DefaultConnection");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Booking>(entity =>
        {
            entity.HasKey(e => e.BookingId).HasName("PK__Bookings__73951ACDFA28DDC3");

            entity.Property(e => e.BookingId).HasColumnName("BookingID");
            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.PaymentMethod).HasMaxLength(20);
            entity.Property(e => e.RoomId).HasColumnName("RoomID");
            entity.Property(e => e.RoomTypeId).HasColumnName("RoomTypeID");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("Pending");
            entity.Property(e => e.TotalPrice).HasColumnType("decimal(12, 2)");

            entity.HasOne(d => d.Customer).WithMany(p => p.Bookings)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Bookings_Customers");

            entity.HasOne(d => d.Room).WithMany(p => p.Bookings)
                .HasForeignKey(d => d.RoomId)
                .HasConstraintName("FK_Bookings_Rooms");

            entity.HasOne(d => d.RoomType).WithMany(p => p.Bookings)
                .HasForeignKey(d => d.RoomTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Bookings_RoomTypes");
        });

        modelBuilder.Entity<BookingService>(entity =>
        {
            entity.HasKey(e => e.BookingServiceId).HasName("PK__BookingS__43F55CD1C9397966");

            entity.Property(e => e.BookingServiceId).HasColumnName("BookingServiceID");
            entity.Property(e => e.BookingId).HasColumnName("BookingID");
            entity.Property(e => e.Quantity).HasDefaultValue(1);
            entity.Property(e => e.ServiceId).HasColumnName("ServiceID");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("Pending");

            entity.HasOne(d => d.Booking).WithMany(p => p.BookingServices)
                .HasForeignKey(d => d.BookingId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BookingServices_Bookings");

            entity.HasOne(d => d.Service).WithMany(p => p.BookingServices)
                .HasForeignKey(d => d.ServiceId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BookingServices_Services");
        });

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => e.CustomerId).HasName("PK__Customer__A4AE64B84CCF35B1");

            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.FullName).HasMaxLength(100);
            entity.Property(e => e.PhoneNumber).HasMaxLength(20);
        });

        modelBuilder.Entity<Room>(entity =>
        {
            entity.HasKey(e => e.RoomId).HasName("PK__Rooms__32863919A979BFF1");

            entity.Property(e => e.RoomId).HasColumnName("RoomID");
            entity.Property(e => e.RoomNumber).HasMaxLength(10);
            entity.Property(e => e.RoomTypeId).HasColumnName("RoomTypeID");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("Available");

            entity.HasOne(d => d.RoomType).WithMany(p => p.Rooms)
                .HasForeignKey(d => d.RoomTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Rooms_RoomTypes");
        });

        modelBuilder.Entity<RoomType>(entity =>
        {
            entity.HasKey(e => e.RoomTypeId).HasName("PK__RoomType__BCC89611E9B180C8");

            entity.Property(e => e.RoomTypeId).HasColumnName("RoomTypeID");
            entity.Property(e => e.BasePrice).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.BedDescription).HasMaxLength(50);
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.Image).HasMaxLength(255);
            entity.Property(e => e.TypeName).HasMaxLength(50);
        });

        modelBuilder.Entity<Service>(entity =>
        {
            entity.HasKey(e => e.ServiceId).HasName("PK__Services__C51BB0EAA41EE700");

            entity.Property(e => e.ServiceId).HasColumnName("ServiceID");
            entity.Property(e => e.ServiceName).HasMaxLength(50);
            entity.Property(e => e.ServiceType).HasMaxLength(20);
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("Available");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CCAC8DB28D9B");

            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.Password).HasMaxLength(255);
            entity.Property(e => e.Role).HasMaxLength(20);
            entity.Property(e => e.UserName).HasMaxLength(50);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
