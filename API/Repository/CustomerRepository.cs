using API.Data;
using API.Entities;
using API.Repository.IRepository;

namespace API.Repository
{
    public class CustomerRepository : Repository<Customer>, ICustomerRepository
    {
        private readonly HotelContext _context;

        public CustomerRepository(HotelContext context) : base(context)
        {
            _context = context;
        }
    }
}
