
namespace API.DTOs
{
    public class MessageDto
    {
        //one to many relationship between sender and message
        //one to many relationship between recipient and message
        public int Id { get; set; }   
        public int SenderId { get; set; }
        public int SenderUsername { get; set; }
        public string SenderPhotoUrl { get; set; }

        public int RecipientId { get; set; }
        public int RecipientUsername { get; set; }
        public string RecipientPhotoUrl { get; set; }
        public string Content { get; set; }
        public DateTime? DateRead { get; set; }
        public DateTime MessageSent { get; set; }
    }
}