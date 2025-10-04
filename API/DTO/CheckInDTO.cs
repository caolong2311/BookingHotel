namespace API.DTO
{
    public class CheckInDTO
    {
        public string FullName { get; set; }

        //public DateTime CheckInDate { get; set; }
        //public DateTime CheckOutDate { get; set; }

        //public int BookingDetailId { get; set; }
        //public string TypeRoom { get; set; }

        //public List<RoomDTO> Rooms { get; set; }
        public List<CustomerBookingDTO> customerBookingDTOs { get; set; }
        
    }
}
