using FacturasAPI.Dominio;
using FacturasAPI.Dominio.Modelo;
using FacturasAPI.Infraestructura.Datos.IRepositorio;
using FacturasAPI.Infraestructura.Persistencia;
using Microsoft.EntityFrameworkCore;

namespace FacturasAPI.Infraestructura.Datos.Repositorio
{
    public class ProductoRepositorio : IProductoRepositorio
    {
        private readonly AppDbContext _context;

        public ProductoRepositorio(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Producto> AgregarProducto(Producto modelo)
        {
            _context.Producto.Add(modelo);
            await _context.SaveChangesAsync();
            return modelo;
        }

        public async Task<Producto> EliminarProducto(Producto modelo)
        {
            modelo.Activo = false;
            modelo.FechaActualizacion = DateTime.Now;
            await _context.SaveChangesAsync();
            return modelo;
        }

        public async Task<bool> ExisteProducto(int id)
        {
            var producto = await _context.Producto.FindAsync(id);
            _context.Entry(producto).State = EntityState.Detached;

            return producto != null ? true : false;
        }

        public async Task<Producto> ModificarProducto(Producto modelo)
        {
            var entidad = _context.Entry(modelo);
            foreach (var propiedad in typeof(Producto).GetProperties())
            {
                var nuevoValor = propiedad.GetValue(modelo);
                if (nuevoValor != null && propiedad.Name != "Id")
                {
                    entidad.Property(propiedad.Name).CurrentValue = nuevoValor;
                    entidad.Property(propiedad.Name).IsModified = true;
                }
            }

            //_context.Producto.Update(modelo);
            await _context.SaveChangesAsync();
            return modelo;
        }

        public async Task<bool> ObtenerProducto(string codigo, int? id = null)
        {
            var productoObj = await _context.Producto.Where(x => x.Codigo == codigo && x.Activo == true).FirstOrDefaultAsync();
            if (productoObj != null)
            {
                _context.Entry(productoObj).State = EntityState.Detached;
                if (id != null && productoObj.Id != id)
                {
                    return false;
                }

                return true;
            }

            return false;
        }

        public async Task<Producto?> ObtenerProductoPorId(int id)
        {
            return await _context.Producto.Where(x => x.Id == id).FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Producto>> ObtenerProductos(PeticionLista modelo)
        {
            var consulta = _context.Producto.AsQueryable();

            if (!string.IsNullOrEmpty(modelo.CampoBuscar))
            {
                consulta = consulta.Where(u => u.Nombre.Contains(modelo.CampoBuscar)
                                      || u.Codigo.Contains(modelo.CampoBuscar));
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

            return await consulta.ToListAsync();
        }
    }
}
