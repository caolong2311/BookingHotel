using API.DTO;
using API.Repository.IRepository;
using iTextSharp.text;
using iTextSharp.text.pdf;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class InvoiceController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public InvoiceController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpPost("generate")]
        public async Task<IActionResult> GenerateInvoice([FromBody] CheckOutDTO dto)
        {
            if (dto == null || dto.ServiceList == null)
                return BadRequest("Thiếu thông tin hóa đơn");

          
            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "invoices");
            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

       
            var fileName = $"Invoice_{dto.BookingDetailId}_{DateTime.Now:yyyyMMddHHmmss}.pdf";
            var filePath = Path.Combine(folderPath, fileName);

         
            string fontPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Fonts), "arial.ttf");
            BaseFont bf = BaseFont.CreateFont(fontPath, BaseFont.IDENTITY_H, BaseFont.EMBEDDED);

    
            var titleFont = new Font(bf, 18, Font.BOLD);
            var normalFont = new Font(bf, 12, Font.NORMAL);

          
            using (var fs = new FileStream(filePath, FileMode.Create))
            {
                var doc = new Document(PageSize.A4, 40, 40, 40, 40);
                PdfWriter.GetInstance(doc, fs);
                doc.Open();

          
                var title = new Paragraph("HÓA ĐƠN THANH TOÁN", titleFont)
                {
                    Alignment = Element.ALIGN_CENTER,
                    SpacingAfter = 20
                };
                doc.Add(title);

                var headerFont = new Font(bf, 12, Font.BOLD);
                doc.Add(new Paragraph($"Mã hóa đơn: {dto.BookingDetailId}", headerFont)
                {
                    SpacingAfter = 8
                });
                doc.Add(new Paragraph($"Khách hàng: {dto.FullName}", normalFont));
                doc.Add(new Paragraph($"Phòng: {dto.RoomNumber}", normalFont));
                doc.Add(new Paragraph($"Ngày nhận: {dto.CheckInDate:dd/MM/yyyy}", normalFont));
                doc.Add(new Paragraph($"Ngày trả: {dto.CheckOutDate:dd/MM/yyyy}", normalFont));
                var serviceTitle = new Paragraph("\nDịch vụ đã sử dụng:", normalFont)
                {
                    SpacingAfter = 10
                };
                doc.Add(serviceTitle);


                var table = new PdfPTable(4) { WidthPercentage = 100 };
                table.SetWidths(new float[] { 4, 2, 2, 2 });

                table.AddCell(new PdfPCell(new Phrase("Tên dịch vụ", headerFont)));
                table.AddCell(new PdfPCell(new Phrase("Số lượng", headerFont)));
                table.AddCell(new PdfPCell(new Phrase("Đơn giá", headerFont)));
                table.AddCell(new PdfPCell(new Phrase("Thành tiền", headerFont)));

              
                foreach (var s in dto.ServiceList)
                {
                    table.AddCell(new Phrase(s.ServiceName ?? "", normalFont));
                    table.AddCell(new Phrase(s.Quantity?.ToString() ?? "0", normalFont));
                    table.AddCell(new Phrase($"{s.Price:N0}₫", normalFont));
                    table.AddCell(new Phrase($"{(s.Quantity * s.Price):N0}₫", normalFont));
                }

                doc.Add(table);

            
                var totalPara = new Paragraph($"\nTổng cộng: {dto.Total:N0}₫", titleFont)
                {
                    Alignment = Element.ALIGN_RIGHT,
                    SpacingBefore = 15
                };
                doc.Add(totalPara);

                var thanks = new Paragraph("\nCảm ơn quý khách, hẹn gặp lại!", normalFont)
                {
                    Alignment = Element.ALIGN_CENTER,
                    SpacingBefore = 20
                };
                doc.Add(thanks);

                doc.Close();
            }

    
            var fileUrl = $"{Request.Scheme}://{Request.Host}/invoices/{fileName}";
            return Ok(new
            {
                Message = "Tạo hóa đơn thành công",
                InvoiceUrl = fileUrl
            });
        }
    }
}
