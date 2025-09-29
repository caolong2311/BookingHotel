using MailKit.Net.Smtp;
using MimeKit;

namespace API.Services
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var emailSettings = _configuration.GetSection("EmailSettings");
            var message = new MimeMessage();

            message.From.Add(new MailboxAddress(
                emailSettings["SenderName"],
                emailSettings["SenderEmail"]));

            message.To.Add(MailboxAddress.Parse(toEmail));
            message.Subject = subject;

            message.Body = new TextPart("html")
            {
                Text = body
            };

            using var client = new SmtpClient();
            await client.ConnectAsync(emailSettings["SmtpServer"],
                                      int.Parse(emailSettings["Port"]),
                                      MailKit.Security.SecureSocketOptions.StartTls);

            await client.AuthenticateAsync(emailSettings["Username"], emailSettings["Password"]);

            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
    }
}
