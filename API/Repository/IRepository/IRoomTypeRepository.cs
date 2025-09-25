using API.Entities;

namespace API.Repository.IRepository
{
    public interface IRoomTypeRepository : IRepository<RoomType>
    {
        Task<List<RoomType>> GetAvailableRoomTypesAsync(DateTime fromDate, DateTime toDate);
    }
}
