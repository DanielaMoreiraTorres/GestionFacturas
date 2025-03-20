using FacturasAPI.Dominio;
using FacturasAPI.Dominio.Modelo;
using FacturasAPI.Infraestructura.Datos.IRepositorio;
using FacturasAPI.Infraestructura.Persistencia;
using Microsoft.EntityFrameworkCore;

namespace FacturasAPI.Infraestructura.Datos.Repositorio
{
    public class UsuarioRepositorio : IUsuarioRepositorio
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public UsuarioRepositorio(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _config = configuration;
        }

        public async Task<Usuario?> ObtenerUsuario(InicioSesion modelo)
        {
            return await _context.Usuario.Where(x => x.NombreUsuario == modelo.Usuario && x.Contrasena == modelo.Contrasena).FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<UsuarioTabla>> ObtenerUsuarios(PeticionLista modelo)
        {
            var consulta = _context.Usuario.AsQueryable();

            if (!string.IsNullOrEmpty(modelo.CampoBuscar))
            {
                consulta = consulta.Where(u => u.Nombres.Contains(modelo.CampoBuscar)
                                      || u.Apellidos.Contains(modelo.CampoBuscar));
            }

            if (!string.IsNullOrEmpty(modelo.CampoOrdenar) && !string.IsNullOrEmpty(modelo.DireccionOrdenar))
            {
                var parametro = modelo.CampoOrdenar.ToLower();
                var direccion = modelo.DireccionOrdenar.ToLower();

                if (direccion == "asc")
                {
                    consulta = consulta.OrderBy(x => EF.Property<object>(x, parametro));
                }
                else if (direccion == "desc")
                {
                    consulta = consulta.OrderByDescending(x => EF.Property<object>(x, parametro));
                }
            }

            consulta = consulta.Skip((modelo.Pagina - 1) * modelo.TamanoPagina)
                         .Take(modelo.TamanoPagina).Where(x => x.Activo == true);
            IEnumerable<Usuario> usuarios = await consulta.ToListAsync();
            List<UsuarioTabla> listaUsuarios = new();

            foreach (var usuario in usuarios)
            {
                var usuarioTabla = new UsuarioTabla
                {
                    Id = usuario.Id ?? 0,
                    Nombres = usuario.Nombres,
                    Apellidos = usuario.Apellidos,
                    NombreUsuario = usuario.NombreUsuario,
                    Correo = usuario.Correo,
                };

                listaUsuarios.Add(usuarioTabla);
            }

            return listaUsuarios;
        }

        public async Task<Usuario> ModificarToken(Usuario modelo)
        {
            await _context.SaveChangesAsync();
            return modelo;
        }

        public async Task<Usuario?> VerificarToken(int id)
        {
            return await _context.Usuario.Where(x => x.Id == id).FirstOrDefaultAsync();
        }

        public async Task<UsuarioModelo> AgregarUsuario(Usuario modelo)
        {
            _context.Usuario.Add(modelo);
            await _context.SaveChangesAsync();
            var usuarioModelo = new UsuarioModelo
            {
                Id = modelo.Id,
                Nombres = modelo.Nombres,
                Apellidos = modelo.Apellidos,
                NombreUsuario = modelo.NombreUsuario,
                Correo = modelo.Correo,
                Activo = modelo.Activo
            };
            return usuarioModelo;
        }

        public async Task<bool> ExisteUsuario(int id)
        {
            var usuario = await _context.Usuario.FindAsync(id);
            _context.Entry(usuario).State = EntityState.Detached;

            return usuario != null ? true : false;
        }

        public async Task<UsuarioModelo> ModificarUsuario(Usuario modelo)
        {
            var entidad = _context.Entry(modelo);
            foreach (var propiedad in typeof(Usuario).GetProperties())
            {
                var nuevoValor = propiedad.GetValue(modelo);
                if (nuevoValor != null && propiedad.Name != "Id")
                {
                    entidad.Property(propiedad.Name).CurrentValue = nuevoValor;
                    entidad.Property(propiedad.Name).IsModified = true;
                }
            }

            //_context.Usuario.Update(modelo);
            await _context.SaveChangesAsync();
            var usuarioModelo = new UsuarioModelo
            {
                Id = modelo.Id,
                Nombres = modelo.Nombres,
                Apellidos = modelo.Apellidos,
                NombreUsuario = modelo.NombreUsuario,
                Correo = modelo.Correo,
                Activo = modelo.Activo
            };
            return usuarioModelo;
        }

        public async Task<UsuarioModelo> EliminarUsuario(Usuario modelo)
        {
            modelo.Activo = false;
            modelo.FechaActualizacion = DateTime.Now;
            await _context.SaveChangesAsync();
            var usuarioModelo = new UsuarioModelo
            {
                Id = modelo.Id,
                Nombres = modelo.Nombres,
                Apellidos = modelo.Apellidos,
                NombreUsuario = modelo.NombreUsuario,
                Correo = modelo.Correo,
                Activo = modelo.Activo
            };
            return usuarioModelo;
        }

        public async Task<Usuario?> ObtenerUsuarioPorId(int id)
        {
            return await _context.Usuario.Where(x => x.Id == id).FirstOrDefaultAsync();
        }

        public async Task<bool> ObtenerUsuario(string usuario, int? id = null)
        {
            var usuarioObj = await _context.Usuario.Where(x => x.NombreUsuario == usuario && x.Activo == true).FirstOrDefaultAsync();
            if (usuarioObj != null)
            {
                _context.Entry(usuarioObj).State = EntityState.Detached;
                if (id != null && usuarioObj.Id != id)
                {
                    return false;
                }

                return true;
            }

            return false;
        }
    }
}
