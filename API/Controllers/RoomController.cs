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
        [HttpPut("check-out")]
        public IActionResult CheckOut([FromQuery] int bookingDetailId)
        {
            try
            {
                var bookingDetail = _unitOfWork.BookingDetail.GetAll().Where(b => b.BookingDetailId == bookingDetailId).FirstOrDefault();
                if (bookingDetail == null)
                {
                    return BadRequest("khong tim thay phong");
                }
                bookingDetail.Status = 1;
                var room = _unitOfWork.Room.GetAll().Where(r => r.RoomNumber == bookingDetail.RoomNumber).FirstOrDefault();
                room.Status = "Còn phòng";
                _unitOfWork.Save();
                var detail = _unitOfWork.BookingDetail.GetAll().Where(d => d.BookingId == bookingDetail.BookingId && d.Status == 0).ToList();
                if (detail.Count == 0)
                {
                    var booking = _unitOfWork.Booking.GetAll().Where(b => b.BookingId == bookingDetail.BookingId).FirstOrDefault();
                    booking.Status = "Đã trả phòng";
                    _unitOfWork.Save();
                }
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
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
                          where b.Status == "Đã nhận phòng"
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
                                  Quantity = bds.Quantity,
                                  Price = bds.Price
                              };
            decimal sum = 0;
            if (listService.Any())
            {
                foreach (var item in listService)
                {
                    sum += item.Price ?? 0;
                }
                ;
            }
            CheckOutDTO checkOutDTO = new CheckOutDTO
            {
                BookingDetailId = result.BookingDetailId,
                RoomNumber = roomNumber,
                FullName = result.FullName,
                CheckInDate = result.CheckInDate,
                CheckOutDate = result.CheckOutDate,
                ServiceList = listService.ToList(),
                Total = sum
            };
            return checkOutDTO;

        }
    }
}
