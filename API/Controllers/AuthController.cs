using API.DTO;
using API.Interfaces;
using API.Repository.IRepository;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ITokenService _tokenService;

        public AuthController(IUnitOfWork unitOfWork, ITokenService tokenService)
        {
            _unitOfWork = unitOfWork;
            _tokenService = tokenService;
        }
        [HttpPost("login")]
        public ActionResult<UserDTO> Login(LoginDTO loginDTO)
        {
            var user = _unitOfWork.User.GetAll().Where(u => u.UserName == loginDTO.Username && u.Password == loginDTO.Password).FirstOrDefault();
            if (user == null) return Unauthorized("Tên đăng nhập không chính xác");
            
            return new UserDTO
            {
                Username = user.FullName,
                Token = _tokenService.CreateToken(user),
            };

        }
    }
}
