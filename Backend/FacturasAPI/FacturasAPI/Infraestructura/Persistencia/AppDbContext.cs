using FacturasAPI.Dominio;
using Microsoft.EntityFrameworkCore;

namespace FacturasAPI.Infraestructura.Persistencia
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Usuario> Usuario { get; set; }
    }
}
