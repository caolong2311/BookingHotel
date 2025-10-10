using API.DTO;
using API.Entities;
using API.Repository.IRepository;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;


        public RoomController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        [HttpGet]
        public List<RoomUserDTO> GetRoom()
        {
          return _unitOfWork.Room.GetRoomsWithCheckout();
        }
        [HttpGet("service")]
        public CheckOutDTO GerService([FromQuery] string roomNumber)
        {
            var result = (from bd in _unitOfWork.BookingDetail.GetAll()
                          join b in _unitOfWork.Booking.GetAll()
                          on bd.BookingId equals b.BookingId
                          join c in _unitOfWork.Customer.GetAll()
                          on b.CustomerId equals c.CustomerId
                          where b.Status == "Đã đặt phòng"
                          && bd.RoomNumber == roomNumber
                          select new
                          {
                              c.FullName,
                              bd.BookingDetailId,
                              b.CheckInDate,
                              b.CheckOutDate,
                          }).FirstOrDefault();
            var listService = from bds in _unitOfWork.ServiceDetail.GetAll()
                              join s in _unitOfWork.Service.GetAll()
                              on bds.ServiceId equals s.ServiceId
                              where bds.BookingDetailId == result.BookingDetailId
                              select new ServiceDTO
                              {
                                  ServiceName = s.ServiceName,
                                  Quantity = bds.Quantity
                              };
            CheckOutDTO checkOutDTO = new CheckOutDTO
            {
                BookingDetailId = result.BookingDetailId,
                RoomNumber = roomNumber,
                FullName = result.FullName,
                CheckInDate = result.CheckInDate,
                CheckOutDate = result.CheckOutDate,
                ServiceList = listService.ToList()
            };
            return checkOutDTO;
            
        }
    }
}
