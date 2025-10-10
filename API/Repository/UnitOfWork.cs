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
        public IRoomRepository Room { get; set; }
        public IServiceDetailRepository ServiceDetail { get; set; }

        public IServiceRepository Service { get; set; }

        private readonly HotelContext _context;

        public UnitOfWork(HotelContext context)
        {
            _context = context;
            RoomTypes = new RoomTypeRepository(_context);
            Customer = new CustomerRepository(_context);
            Booking = new BookingRepository(_context);
            BookingDetail = new BookingDetailRepository(_context);
            Room = new RoomRepository(_context);
            ServiceDetail = new ServiceDetailRepository(_context);
            Service = new ServiceRepository(_context);
        }

        public  int Save()
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
