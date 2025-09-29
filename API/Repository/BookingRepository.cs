using API.Data;
using API.Entities;
using API.Repository.IRepository;

namespace API.Repository
{
    public class BookingRepository : Repository<Booking>, IBookingRepository
    {
        private readonly HotelContext _context;
        public BookingRepository(HotelContext context) : base(context)
        {
            _context = context;
        }
    }
}
