using API.DTO;
using API.Entities;
using API.Repository.IRepository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Security.Cryptography;
using System.Text;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public BookingController(IUnitOfWork unitOfWork, IConfiguration configuration, IHttpClientFactory httpClientFactory)
        {
            _unitOfWork = unitOfWork;
            _configuration = configuration;
            _httpClient = httpClientFactory.CreateClient();
        }

        [HttpPost("create-payment")]
        public async Task<IActionResult> CreatePayment([FromBody] PaymentDTO dto)
        {
            if (dto == null || dto.Amount <= 0)
                return BadRequest("Dữ liệu không hợp lệ");

            string endpoint = _configuration["Momo:Endpoint"];
            string partnerCode = _configuration["Momo:PartnerCode"];
            string accessKey = _configuration["Momo:AccessKey"];
            string secretKey = _configuration["Momo:SecretKey"];
            string redirectUrl = _configuration["Momo:RedirectUrl"];
            string ipnUrl = _configuration["Momo:IpnUrl"];

            string orderId = Guid.NewGuid().ToString();
            string requestId = $"{partnerCode}_{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
            string orderInfo = $"Thanh toán hóa đơn #{orderId}";
            string amount = dto.Amount.ToString();
            string requestType = "captureWallet";
            string extraData = "";

      
            string rawHash =
                $"accessKey={accessKey}" +
                $"&amount={amount}" +
                $"&extraData={extraData}" +
                $"&ipnUrl={ipnUrl}" +
                $"&orderId={orderId}" +
                $"&orderInfo={orderInfo}" +
                $"&partnerCode={partnerCode}" +
                $"&redirectUrl={redirectUrl}" +
                $"&requestId={requestId}" +
                $"&requestType={requestType}";

          
            string signature;
            using (var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secretKey)))
            {
                var hashValue = hmac.ComputeHash(Encoding.UTF8.GetBytes(rawHash));
                signature = BitConverter.ToString(hashValue).Replace("-", "").ToLower();
            }

            var requestData = new
            {
                partnerCode,
                accessKey,
                requestId,
                amount,
                orderId,
                orderInfo,
                redirectUrl,
                ipnUrl,
                extraData,
                requestType,
                signature,
                lang = "vi"
            };

            using var httpClient = new HttpClient();
            var content = new StringContent(JsonConvert.SerializeObject(requestData), Encoding.UTF8, "application/json");

            var response = await httpClient.PostAsync(endpoint, content);
            var responseContent = await response.Content.ReadAsStringAsync();

            var momoResponse = JsonConvert.DeserializeObject<MomoResponseDTO>(responseContent);

            if (momoResponse != null && momoResponse.ResultCode == 0)
            {
                return Ok(new { success = true, momoResponse.PayUrl });
            }
            else
            {
                return BadRequest(new { success = false, message = momoResponse?.Message ?? "Lỗi không xác định", raw = responseContent });
            }
        }




        [HttpPost]
        public async Task<IActionResult> Booking(BookingDto bookingDto)
        {
            if (bookingDto == null) return BadRequest("Lỗi dữ liệu");
            try
            {
                await _unitOfWork.ExecuteInTransactionAsync(async () =>
                {
                    var customer = _unitOfWork.Customer.Get(c => c.PhoneNumber == bookingDto.PhoneNumber);
                    if (customer == null)
                    {
                        customer = new Customer
                        {
                            FullName = bookingDto.CustomerName,
                            PhoneNumber = bookingDto.PhoneNumber,
                            Email = bookingDto.Email
                        };
                        _unitOfWork.Customer.Add(customer);
                        _unitOfWork.Save();
                    }
                    var booking = new Booking
                    {
                        CustomerId = customer.CustomerId,
                        CheckInDate = bookingDto.CheckInDate,
                        CheckOutDate = bookingDto.CheckOutDate,
                        Status = "Đặt phòng",
                        TotalPrice = bookingDto.TotalPrice
                    };
                    _unitOfWork.Booking.Add(booking);
                    _unitOfWork.Save();
                    foreach (var d in bookingDto.Details)
                    {
                        for (int i = 0; i < d.Quantity; i++)
                        {
                            var detail = new BookingDetail
                            {
                                BookingId = booking.BookingId,
                                RoomTypeId = d.RoomTypeId,
                                Price = d.Price,
                                RoomNumber = null
                            };
                            _unitOfWork.BookingDetail.Add(detail);
                        }
                    }
                    _unitOfWork.Save();
                });

                return Ok(new { Message = "Đặt phòng thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Đặt phòng thất bại", Error = ex.Message });
            }
        }
    }
}
