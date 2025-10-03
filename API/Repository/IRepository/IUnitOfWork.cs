namespace API.Repository.IRepository
{
    public interface IUnitOfWork
    {
        IRoomTypeRepository RoomTypes { get; set; }
        ICustomerRepository Customer { get; set; }

        IBookingRepository Booking { get; set; }
        IBookingDetailRepository BookingDetail { get; set; }

        IRoomRepository Room { get; set; }
        int Save();
        Task ExecuteInTransactionAsync(Func<Task> action);
    }
}
