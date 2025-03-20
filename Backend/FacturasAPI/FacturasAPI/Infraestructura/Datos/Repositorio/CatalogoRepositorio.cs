using FacturasAPI.Dominio;
using FacturasAPI.Infraestructura.Datos.IRepositorio;
using FacturasAPI.Infraestructura.Persistencia;
using Microsoft.EntityFrameworkCore;

namespace FacturasAPI.Infraestructura.Datos.Repositorio
{
    public class CatalogoRepositorio : ICatalogoRepositorio
    {
        private readonly AppDbContext _context;

        public CatalogoRepositorio(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TipoIdentificacion>> ObtenerCatalogoTipoIdentificacion()
        {
            return await _context.TipoIdentificacion.ToListAsync();
        }
    }
}
