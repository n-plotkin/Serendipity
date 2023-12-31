using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
    public class TokenService : ITokenService
    {
        //Symetric key: same key used to encrypt as decrypt
        //Asymetric: when your server needs to encrypt, and client needs to decrypt
        //Private stays on server, public can be used to decrypt
            //This is how it works in HTTPS and SSL
        //Here, our client doesn't need to decrypt their key
        private readonly SymmetricSecurityKey _key;
        private readonly UserManager<AppUser> _userManager;
        public TokenService(IConfiguration config, UserManager<AppUser> userManager)
        {
            _userManager = userManager;
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));
        }
        public async Task<string> CreateToken(AppUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.NameId, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName)

            }; //We don't check if the claim is true here. Must authenticate elsewhere.
            
            var roles = await _userManager.GetRolesAsync(user);
            //for the claims, add elements that for each role, project it to a new claim.
            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            //Create encoded version of key
            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);
            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
                //Pass back encoded key
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            //completed token (obviously for internal use, this isn't passing to user yet)
            return tokenHandler.WriteToken(token);
        }
    }
}