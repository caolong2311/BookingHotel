using API.Data;
using API.DTO;
using API.Entities;
using API.Repository.IRepository;
using Microsoft.EntityFrameworkCore;

namespace API.Repository
{
    public class RoomRepository : Repository<Room>, IRoomRepository
    {
        private readonly HotelContext _context;

        public RoomRepository(HotelContext context) : base(context)
        {
            _context = context;
        }

        public List<RoomUserDTO> GetRoomsWithCheckout()
        {
            return _context.RoomWithCheckout
            .FromSqlRaw("EXEC sp_GetRoom")
            .ToList();
        }
    }
}
