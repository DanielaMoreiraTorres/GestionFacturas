using FacturasAPI.Dominio.Modelo;
using FacturasAPI.Infraestructura.Datos.IRepositorio;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace FacturasAPI.Aplicacion.Usuario
{
    public class UsuarioServicio : IUsuarioServicio
    {
        private readonly IConfiguration _config;
        private readonly IUsuarioRepositorio _usuarioRepositorio;

        public UsuarioServicio(IConfiguration config, IUsuarioRepositorio usuarioRepositorio)
        {
            _config = config;
            _usuarioRepositorio = usuarioRepositorio;
        }

        public async Task<Respuesta> InicioSesion(InicioSesion modelo)
        {
            var usuario = await _usuarioRepositorio.ObtenerUsuario(modelo);

            if (usuario == null)
            {
                return new Respuesta()
                {
                    IsSuccess = false,
                    Message = "Login fallo",
                    Errors = ["Usuario y/o clave incorrectos"]
                };
            }

            if (!usuario.Activo)
            {
                return new Respuesta()
                {
                    IsSuccess = false,
                    Message = "Login fallo",
                    Errors = ["Usuario inactivo"]
                };
            }

            var jwt = GenerarJWT(usuario);
            var token = new JwtSecurityTokenHandler().WriteToken(jwt);
            var refreshToken = GenerarRefreshToken();

            usuario.Token = token;
            usuario.RefreshToken = refreshToken;
            usuario.ExpiracionToken = jwt.ValidTo.ToUniversalTime();

            await _usuarioRepositorio.ModificarToken(usuario);

            return new Respuesta()
            {
                IsSuccess = true,
                Message = "Login de usuario correcto",
                Data = new
                {
                    User = new
                    {
                        id = usuario.Id,
                        nombreUsuario = usuario.NombreUsuario,
                        nombres = usuario.Nombres,
                        apellidos = usuario.Apellidos,
                    },
                    token,
                    refreshToken,
                    expDate = jwt.ValidTo.ToString("dd/MM/yyyy HH:mm:ss.fff")
                }
            };
        }

        JwtSecurityToken GenerarJWT(Dominio.Usuario usuario)
        {
            var claims = new List<Claim>
            {
                new("id", usuario.Id?.ToString())
            };

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Token:Key"]!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);
            var now = DateTime.UtcNow;

            return new JwtSecurityToken(
                claims: claims,
                notBefore: now,
                expires: now.AddMinutes(double.Parse(_config["Token:TimeMinuteExpires"]!)),
                signingCredentials: credentials
            );
        }

        static string GenerarRefreshToken()
        {
            var byteArray = new byte[64];
            var refeshToken = string.Empty;

            using (var mg = RandomNumberGenerator.Create())
            {
                mg.GetBytes(byteArray);
                refeshToken = Convert.ToBase64String(byteArray);
            }

            return refeshToken;
        }
    }
}
