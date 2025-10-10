using API.DTO;
using API.Entities;

namespace API.Repository.IRepository
{
    public interface IRoomRepository : IRepository<Room>
    {
        List<RoomUserDTO> GetRoomsWithCheckout();
    }
}
