using API.Data;
using API.Entities;
using API.Repository.IRepository;

namespace API.Repository
{
    public class ServiceDetailRepository : Repository<BookingDetailService>, IServiceDetailRepository
    {
        private readonly HotelContext _context;
        public ServiceDetailRepository(HotelContext context) : base(context)
        {
            _context = context;
        }
    }
}
