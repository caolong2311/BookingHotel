using API.Data;
using API.Entities;
using API.Repository.IRepository;

namespace API.Repository
{
    public class ServiceRepository : Repository<Service>, IServiceRepository
    {
        private readonly HotelContext _context;

        public ServiceRepository(HotelContext context) : base(context)
        {
            _context = context;
        }
    }
}
