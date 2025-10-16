using API.Entities;
using API.Repository.IRepository;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class CustomerController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        public CustomerController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        [HttpGet]
        public IActionResult Index()
        {
            try
            {
                var data = (from c in _unitOfWork.Customer.GetAll()
                join b in _unitOfWork.Booking.GetAll()
                on c.CustomerId equals b.CustomerId into cb
                            from b in cb.OrderByDescending(x => x.BookingId).Take(1).DefaultIfEmpty()
                            select new
                            {
                                c.CustomerId,
                                c.FullName,
                                c.PhoneNumber,
                                c.Email,
                                BookingStatus = b.Status
                            })
                            .ToList();

                return Ok(data);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
