namespace API.DTO
{
    public class UpdateRoomDTO
    {
        public int RoomTypeId { get; set; }
        public List<RoomDTO> roomDTOs { get; set; }
    }
}
