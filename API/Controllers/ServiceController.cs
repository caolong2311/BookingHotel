using API.DTO;
using API.Entities;
using API.Repository.IRepository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ServiceController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        public ServiceController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        [HttpGet]
        public List<Service> GetAll()
        {
            return _unitOfWork.Service.GetAll().Where(s => s.Status == "Đang hoạt động").ToList();
        }
        [HttpPut("{id}")]
        public IActionResult Put(int id, Service service)
        {
            if (id != service.ServiceId) return BadRequest("ID không khớp");

            _unitOfWork.Service.Update(service);
            _unitOfWork.Save();
            return Ok("Cập nhật dịch vụ thành công");
        }
        [HttpPost("add-service")]
        public ActionResult Post(Service service)
        {
            try
            {
                _unitOfWork.Service.Add(service);
                _unitOfWork.Save();
                return Ok("Thêm dịch vụ thành công");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("service-user")]
        public IActionResult GetService([FromBody] List<ServiceDetailDTO> dto)
        {
            try
            {
                foreach (var item in dto)
                {
                    var service = _unitOfWork.ServiceDetail.GetAll().FirstOrDefault(s => s.BookingDetailId == item.BookingDetailId && s.ServiceId == item.ServiceId);
                    if (service != null)
                    {
                        service.Quantity += item.Quantity;

                    }
                    else
                    {
                        BookingDetailService bookingDetailService = new BookingDetailService
                        {
                            BookingDetailId = item.BookingDetailId,
                            ServiceId = item.ServiceId,
                            Quantity = item.Quantity
                        };
                        _unitOfWork.ServiceDetail.Add(bookingDetailService);
                    }
                    _unitOfWork.Save();

                }
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
