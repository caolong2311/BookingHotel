using API.Data;
using API.Entities;
using API.Repository.IRepository;

namespace API.Repository
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(HotelContext context) : base(context)
        {
        }
    }
}
