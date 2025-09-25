using API.Data;
using API.Entities;
using API.Repository.IRepository;
using Microsoft.EntityFrameworkCore;
using System;

namespace API.Repository
{
    public class RoomTypeCategory : Repository<RoomType>, IRoomTypeRepository
    {
        private readonly HotelContext _context;
        public RoomTypeCategory(HotelContext context) : base(context)
        {
            _context = context;
        }

        public async Task<List<RoomType>> GetAvailableRoomTypesAsync(DateTime fromDate, DateTime toDate)
        {
            return await _context.RoomTypes
                .FromSqlRaw("EXEC GetAvailableRoomTypes @FromDate = {0}, @ToDate = {1}", fromDate, toDate)
                .ToListAsync();
        }
    }
}
