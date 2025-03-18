using FacturasAPI.Dominio;
using FacturasAPI.Dominio.Modelo;
using FacturasAPI.Infraestructura.Datos.IRepositorio;
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
                    Exito = false,
                    Mensaje = "Login fallo",
                    Errores = ["Usuario y/o clave incorrectos"]
                };
            }

            if (!usuario.Activo)
            {
                return new Respuesta()
                {
                    Exito = false,
                    Mensaje = "Login fallo",
                    Errores = ["Usuario inactivo"]
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
                Exito = true,
                Mensaje = "Login de usuario correcto",
                Datos = new
                {
                    usuario = new
                    {
                        id = usuario.Id,
                        nombreUsuario = usuario.NombreUsuario,
                        nombres = usuario.Nombres,
                        apellidos = usuario.Apellidos,
                        correo = usuario.Correo,
                    },
                    token,
                    refreshToken,
                    expiracionToken = jwt.ValidTo.ToString("dd/MM/yyyy HH:mm:ss.fff")
                }
            };
        }

        public async Task<Respuesta> VerificarToken(int usuarioId, string cabeceraAutenticacion)
        {
            Respuesta result = new()
            {
                Exito = false,
                Mensaje = "Verificar Token fallo",
                Errores = ["El token no es valido"]
            };

            if (usuarioId != null && cabeceraAutenticacion != null && cabeceraAutenticacion.StartsWith("Bearer "))
            {
                var token = cabeceraAutenticacion["Bearer ".Length..].Trim();
                var usuarioResultado = await _usuarioRepositorio.VerificarToken(usuarioId);

                if (usuarioResultado == null)
                {
                    return new Respuesta()
                    {
                        Exito = false,
                        Mensaje = "Verificar token fallo",
                        Errores = ["No se encontró el usuario"]
                    };
                }

                if (!usuarioResultado.Activo)
                {
                    return new Respuesta()
                    {
                        Exito = false,
                        Mensaje = "Verificar token fallo",
                        Errores = ["Usuario inactivo"]
                    };
                }

                if (usuarioResultado.Token != token)
                {
                    return new Respuesta()
                    {
                        Exito = false,
                        Mensaje = "Check token fallo",
                        Errores = ["El token cambió"]
                    };
                }

                return new Respuesta(
                    new
                    {
                        usuario = new
                        {
                            id = usuarioResultado.Id,
                            nombreUsuario = usuarioResultado.NombreUsuario,
                            nombres = usuarioResultado.Nombres,
                            apellidos = usuarioResultado.Apellidos,
                            correo = usuarioResultado.Correo,
                        },
                        token,
                        refreshToken = usuarioResultado.RefreshToken,
                        expiracionToken = usuarioResultado.ExpiracionToken?.ToString("dd/MM/yyyy HH:mm:ss.fff")
                    }
                );
            }

            return result;
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
