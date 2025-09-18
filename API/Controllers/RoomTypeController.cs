using API.Data;
using API.Entities;
using API.Repository.IRepository;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RoomTypeController : Controller
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
    }
}
