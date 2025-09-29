
using API.Entities;
using API.Repository.IRepository;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomTypeController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public RoomTypeController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        [HttpGet]
        public List<RoomType> GetAll()
        {
            return _unitOfWork.RoomTypes.GetAll().ToList();
        }
        [HttpGet("available")]
        public async Task<IActionResult> GetAvailable([FromQuery] DateTime fromDate, [FromQuery] DateTime toDate)
        {
            var rooms = await _unitOfWork.RoomTypes.GetAvailableRoomTypesAsync(fromDate, toDate);
            return Ok(rooms);
        }
    }
}
