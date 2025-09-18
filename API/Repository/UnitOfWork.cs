using API.Data;
using API.Repository.IRepository;

namespace API.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        public IRoomTypeRepository RoomTypes {  get; set; }

        private readonly HotelContext _context;

        public UnitOfWork(HotelContext context)
        {
            _context = context;
            RoomTypes = new RoomTypeCategory(_context);
        }

        public int Save()
        {
            return _context.SaveChanges();
        }
    }
}
