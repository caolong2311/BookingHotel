using API.Data;
using API.Entities;
using API.Repository.IRepository;

namespace API.Repository
{
    public class RoomRepository : Repository<Room>, IRoomRepository
    {
        private readonly HotelContext _context;

        public RoomRepository(HotelContext context) : base(context)
        {
            _context = context;
        }
    }
}
