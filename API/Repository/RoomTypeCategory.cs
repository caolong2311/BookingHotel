using API.Data;
using API.Entities;
using API.Repository.IRepository;

namespace API.Repository
{
    public class RoomTypeCategory : Repository<RoomType>, IRoomTypeRepository
    {
        public RoomTypeCategory(HotelContext context) : base(context)
        {
        }
    }
}
