using API.Data;
using API.Repository.IRepository;

namespace API.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        public IRoomTypeRepository RoomTypes { get; set; }
        public ICustomerRepository Customer { get; set; }

        public IBookingRepository Booking { get; set; }
        public IBookingDetailRepository BookingDetail { get; set; }


        private readonly HotelContext _context;

        public UnitOfWork(HotelContext context)
        {
            _context = context;
            RoomTypes = new RoomTypeCategory(_context);
            Customer = new CustomerRepository(_context);
            Booking = new BookingRepository(_context);
            BookingDetail = new BookingDetailRepository(_context);
        }

        public int Save()
        {
            return _context.SaveChanges();
        }
        public async Task ExecuteInTransactionAsync(Func<Task> action)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                await action();
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        
    }
}
