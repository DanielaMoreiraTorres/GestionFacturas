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

        public async Task<Usuario> ModificarToken(Usuario modelo)
        {
            await _context.SaveChangesAsync();
            return modelo;
        }

        public async Task<Usuario?> VerificarToken(int id)
        {
            return await _context.Usuario.Where(x => x.Id == id).FirstOrDefaultAsync();
        }
    }
}
