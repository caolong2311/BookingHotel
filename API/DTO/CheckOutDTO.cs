namespace API.DTO
{
    public class CheckOutDTO
    {
        public int BookingDetailId { get; set; }
        public string RoomNumber { get; set; }
        public string FullName { get; set; }

        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }

        public List<ServiceDTO> ServiceList { get; set; }

        public decimal Total { get; set; }

    }
}
