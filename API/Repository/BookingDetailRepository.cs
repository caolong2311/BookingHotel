using API.Data;
using API.Entities;
using API.Repository.IRepository;

namespace API.Repository
{
    public class BookingDetailRepository : Repository<BookingDetail>, IBookingDetailRepository
    {
        private readonly HotelContext _context;
        public BookingDetailRepository(HotelContext context) : base(context) 
        {
            _context = context;
        }
    }
}
