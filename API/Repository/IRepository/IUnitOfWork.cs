namespace API.Repository.IRepository
{
    public interface IUnitOfWork
    {
        IRoomTypeRepository RoomTypes { get; set; }
        int Save();
    }
}
