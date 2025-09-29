namespace API.DTO
{
    public class BookingDto
    {
        public string CustomerName { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int Nights { get; set; }
        public decimal TotalPrice { get; set; }
        public List<BookingDetailDto> Details { get; set; }
    }
}
