using API.DTO;
using API.Entities;
using API.Repository.IRepository;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Globalization;
using System.Security.Cryptography;
using System.Text;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BookingController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;
        private readonly EmailService _emailService;

        public BookingController(IUnitOfWork unitOfWork, IConfiguration configuration, IHttpClientFactory httpClientFactory, EmailService emailService)
        {
            _unitOfWork = unitOfWork;
            _configuration = configuration;
            _httpClient = httpClientFactory.CreateClient();
            _emailService = emailService;
        }
        [AllowAnonymous]
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
        [AllowAnonymous]
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

        
                    if (!string.IsNullOrEmpty(customer.Email))
                    {
                        var vietnamCulture = new CultureInfo("vi-VN");
                        string totalPrice = booking.TotalPrice.Value.ToString("C0", vietnamCulture);
                        string subject = "Xác nhận đặt phòng tại Dragon Hotel";

                        string body = $@"
                            <p>Xin chào {customer.FullName},</p>
                            <p>Cảm ơn bạn đã đặt phòng tại <strong>Dragon Hotel</strong>.</p>

                            <p><strong>Chi tiết đặt phòng:</strong></p>
                            <ul>
                                <li>Mã booking: {booking.BookingId}</li>
                                <li>Ngày nhận phòng: {booking.CheckInDate:dd/MM/yyyy}</li>
                                <li>Ngày trả phòng: {booking.CheckOutDate:dd/MM/yyyy}</li>
                                <li>Tổng tiền: {totalPrice} VNĐ</li>
                            </ul>

                            <p><strong>Thông tin khách sạn:</strong></p>
                            <ul>
                                <li>Địa chỉ: 123 Đường Nguyễn Đức Cảnh, An Biên, TP. Hải Phòng</li>
                                <li>Điện thoại: +84 123 456 789</li>
                            </ul>

                            <p>Chúng tôi rất hân hạnh được phục vụ bạn!</p>
                            ";
                        try
                        {
                            await _emailService.SendEmailAsync(customer.Email, subject, body);
                        }
                        catch
                        {
                       
                        }
                    }
                });

                return Ok(new { Message = "Đặt phòng thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Đặt phòng thất bại", Error = ex.Message });
            }
        }
        [HttpGet("check-in")]
        public CheckInDTO CheckIn([FromQuery] string phone)
        {
            var customer = _unitOfWork.Customer.GetAll().Where(p => p.PhoneNumber == phone).FirstOrDefault();
            var booking = from c in _unitOfWork.Customer.GetAll()
                          join b in _unitOfWork.Booking.GetAll()                         
                              on c.CustomerId equals b.CustomerId
                          where c.CustomerId == customer.CustomerId
                               && b.Status == "Đặt phòng"
                               && DateTime.Now >= b.CheckInDate
                               && DateTime.Now <= b.CheckOutDate.AddDays(1)
                               && b.Status != "Đã nhận phòng"
                         select new CustomerBookingDTO
                         {
                             BookingId = b.BookingId,
                             CheckInDate = b.CheckInDate,
                             CheckOutDate = b.CheckOutDate
                         };
            CheckInDTO checkInDTO = new CheckInDTO
            {
                FullName = customer.FullName,
                customerBookingDTOs = booking.ToList()
            };
            return checkInDTO;
            //var result = from c in _unitOfWork.Customer.GetAll()
            //             join b in _unitOfWork.Booking.GetAll() on c.CustomerId equals b.CustomerId
            //             where c.PhoneNumber == phone
            //                   && b.Status == "Đặt phòng"
            //                   && DateTime.Now >= b.CheckInDate
            //                   && DateTime.Now <= b.CheckOutDate
            //             select new
            //             {
            //                 b.BookingId,
            //                 c.FullName,
            //                 b.CheckInDate,
            //                 b.CheckOutDate
            //             };

            //List<CheckInDTO> checkInList = new List<CheckInDTO>();


            //foreach (var booking in result)
            //{

            //    var typeRooms = from bd in _unitOfWork.BookingDetail.GetAll()
            //                    join rt in _unitOfWork.RoomTypes.GetAll() on bd.RoomTypeId equals rt.RoomTypeId
            //                    where bd.BookingId == booking.BookingId
            //                    && bd.RoomNumber == null
            //                    select new
            //                    {   bd.BookingDetailId,
            //                        bd.RoomTypeId,
            //                        rt.TypeName
            //                    };


            //    foreach (var item in typeRooms)
            //    {
            //        var room = from r in _unitOfWork.Room.GetAll()
            //                   where r.RoomTypeId == item.RoomTypeId
            //                         && r.Status == "Còn phòng"
            //                   select new RoomDTO
            //                   {
            //                       RoomNumber = r.RoomNumber
            //                   };

            //        CheckInDTO checkIn = new CheckInDTO
            //        {
            //            FullName = booking.FullName,
            //            CheckInDate = booking.CheckInDate,
            //            CheckOutDate = booking.CheckOutDate,
            //            BookingDetailId = item.BookingDetailId,
            //            TypeRoom = item.TypeName,
            //            Rooms = room.ToList()
            //        };

            //        checkInList.Add(checkIn);
            //    }
            //}

            //return checkInList;
        }
        [AllowAnonymous]
        [HttpGet("detail-booking")]
        public List<RoomDetailDTO> DetailBooking([FromQuery] int bookingID)
        {
            var result = (from b in _unitOfWork.BookingDetail.GetAll()
                          join t in _unitOfWork.RoomTypes.GetAll()
                              on b.RoomTypeId equals t.RoomTypeId
                          where b.BookingId == bookingID && b.RoomNumber == null
                          group b by new { b.RoomTypeId, t.TypeName } into g
                          select new
                          {
                              RoomTypeId = g.Key.RoomTypeId,
                              TypeName = g.Key.TypeName,
                              Quantity = g.Count()
                          }).ToList();
            List<RoomDetailDTO> roomDetailDTOs = new List<RoomDetailDTO>();
            foreach(var b in result)
            {
                var room = from r in _unitOfWork.Room.GetAll()
                           where r.RoomTypeId == b.RoomTypeId
                             && r.Status == "Còn phòng"
                           select new RoomDTO
                           {
                               RoomNumber = r.RoomNumber
                           };
                RoomDetailDTO roomDetailDTO = new RoomDetailDTO
                {
                    RoomTypeId = b.RoomTypeId,
                    TypeName = b.TypeName,
                    Quantity = b.Quantity,
                    roomDTOs = room.ToList()
                };
                roomDetailDTOs.Add(roomDetailDTO);
            }
            return roomDetailDTOs;

        }
        [HttpPut("update-room")]
        public async Task<IActionResult> UpdateRoom(
             [FromQuery] int bookingID,
             [FromBody] List<UpdateRoomDTO> dto)
        {
            try
            {
                await _unitOfWork.ExecuteInTransactionAsync(async () =>
                {
                    var booking = _unitOfWork.Booking.GetAll()
                        .FirstOrDefault(b => b.BookingId == bookingID);

                    if (booking == null)
                        throw new Exception($"Không tìm thấy booking ID = {bookingID}");

                    booking.Status = "Đã nhận phòng";
                    _unitOfWork.Booking.Update(booking);

                    foreach (var b in dto)
                    {
                        var bookingDetails = _unitOfWork.BookingDetail.GetAll()
                            .Where(bd => bd.BookingId == bookingID && bd.RoomTypeId == b.RoomTypeId)
                            .ToList();

                        for (var i = 0; i < bookingDetails.Count; i++)
                        {
                            bookingDetails[i].RoomNumber = b.roomDTOs[i].RoomNumber;
                            _unitOfWork.BookingDetail.Update(bookingDetails[i]);

                            var room = _unitOfWork.Room.GetAll()
                                .FirstOrDefault(r => r.RoomNumber == b.roomDTOs[i].RoomNumber);

                            if (room == null)
                                throw new Exception($"Không tìm thấy phòng {b.roomDTOs[i].RoomNumber}");

                            room.Status = "Hết phòng";
                            _unitOfWork.Room.Update(room);
                        }
                    }

                    _unitOfWork.Save();
                });

                return Ok("Cập nhật thành công");
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi khi cập nhật: {ex.Message}");
            }
        }


    }
}
