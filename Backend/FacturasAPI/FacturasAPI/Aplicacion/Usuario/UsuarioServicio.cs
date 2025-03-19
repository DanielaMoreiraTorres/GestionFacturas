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
            var contrasenaHasheada = HashearContrasena(modelo.Contrasena);
            modelo.Contrasena = contrasenaHasheada;

            var usuario = await _usuarioRepositorio.ObtenerUsuario(modelo);

            if (usuario == null)
            {
                return new Respuesta()
                {
                    Exito = false,
                    Mensaje = "Usuario y/o clave incorrectos",
                    Errores = ["Login falló"]
                };
            }

            if (!usuario.Activo)
            {
                return new Respuesta()
                {
                    Exito = false,
                    Mensaje = "Usuario inactivo",
                    Errores = ["Login falló"]
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

        public async Task<Respuesta> Listar(PeticionLista modelo)
        {
            var usuarios = await _usuarioRepositorio.ObtenerUsuarios(modelo);
            return new Respuesta(usuarios);
        }

        public async Task<Respuesta> Agregar(Dominio.Usuario modelo)
        {
            if (!await _usuarioRepositorio.ObtenerUsuario(modelo.NombreUsuario))
            {
                var contrasenaHasheada = HashearContrasena(modelo.Contrasena);
                modelo.Contrasena = contrasenaHasheada;

                var usuario = await _usuarioRepositorio.AgregarUsuario(modelo);
                return new Respuesta(usuario);
            }

            return new Respuesta()
            {
                Exito = false,
                Mensaje = "El nombre de usuario ya está en uso por otro usuario",
                Errores = ["Registro falló"]
            };
        }

        /// <summary>
        /// Metodo para modificar la informacion del usuario
        /// </summary>
        /// <param name="modelo">Modelo  contiene los datos del usuario</param>
        /// <param name="id">Id del usuario</param>
        /// <returns>Modelo del usuario modificado</returns>
        public async Task<Respuesta> Modificar(int id, Dominio.Usuario modelo)
        {
            if (await _usuarioRepositorio.ObtenerUsuario(modelo.NombreUsuario, id))
            {
                if (!string.IsNullOrEmpty(modelo.Contrasena))
                {
                    var contrasenaHasheada = HashearContrasena(modelo.Contrasena);
                    modelo.Contrasena = contrasenaHasheada;
                }

                var usuario = await _usuarioRepositorio.ModificarUsuario(modelo);
                return new Respuesta(usuario);
            }

            return new Respuesta()
            {
                Exito = false,
                Mensaje = "El nombre de usuario ya está en uso por otro usuario",
                Errores = ["Modificación falló"]
            };
        }

        public async Task<Respuesta> Eliminar(int id)
        {
            var usuario = await _usuarioRepositorio.ObtenerUsuarioPorId(id);
            if (usuario != null)
            {
                await _usuarioRepositorio.EliminarUsuario(usuario);
                return new Respuesta(usuario);
            }

            return new Respuesta()
            {
                Exito = false,
                Mensaje = "No se pudo eliminar el usuario",
                Errores = ["Eliminación falló"]
            };
        }

        public async Task<Respuesta> Obtener(int id)
        {
            var usuario = await _usuarioRepositorio.ObtenerUsuarioPorId(id);

            if (usuario != null)
            {
                return new Respuesta(usuario);
            }

            return new Respuesta()
            {
                Exito = false,
                Mensaje = "Error a obtener usuario",
                Errores = ["Obtener por Id falló"]
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

        public async Task<bool> Existe(int id)
        {
            return await _usuarioRepositorio.ExisteUsuario(id);
        }

        public string HashearContrasena(string contrasena)
        {
            using (SHA256 sha256Hash = SHA256.Create())
            {
                string saltedPassword = contrasena;
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(saltedPassword));
                StringBuilder builder = new StringBuilder();
                foreach (byte b in bytes)
                {
                    builder.Append(b.ToString("x2"));
                }
                return builder.ToString();
            }
        }
    }
}
