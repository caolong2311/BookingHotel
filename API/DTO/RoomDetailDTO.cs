namespace API.DTO
{
    public class RoomDetailDTO
    {
        public int RoomTypeId { get; set; }

        public string TypeName { get; set; } 

        public int Quantity { get; set; }

        public List<RoomDTO> roomDTOs {  get; set; }
    }
}
