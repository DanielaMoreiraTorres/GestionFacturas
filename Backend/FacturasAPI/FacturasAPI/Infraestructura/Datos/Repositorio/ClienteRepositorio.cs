using FacturasAPI.Dominio;
using FacturasAPI.Dominio.Modelo;
using FacturasAPI.Infraestructura.Datos.IRepositorio;
using FacturasAPI.Infraestructura.Persistencia;
using Microsoft.EntityFrameworkCore;

namespace FacturasAPI.Infraestructura.Datos.Repositorio
{
    public class ClienteRepositorio : IClienteRepositorio
    {
        private readonly AppDbContext _context;

        public ClienteRepositorio(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Cliente> AgregarCliente(Cliente modelo)
        {
            _context.Cliente.Add(modelo);
            await _context.SaveChangesAsync();
            return modelo;
        }

        public async Task<Cliente> EliminarCliente(Cliente modelo)
        {
            modelo.Activo = false;
            modelo.FechaActualizacion = DateTime.Now;
            await _context.SaveChangesAsync();
            return modelo;
        }

        public async Task<bool> ExisteCliente(int id)
        {
            var cliente = await _context.Cliente.FindAsync(id);
            _context.Entry(cliente).State = EntityState.Detached;

            return cliente != null ? true : false;
        }

        public async Task<Cliente> ModificarCliente(Cliente modelo)
        {
            var entidad = _context.Entry(modelo);
            foreach (var propiedad in typeof(Cliente).GetProperties())
            {
                var nuevoValor = propiedad.GetValue(modelo);
                if (nuevoValor != null && propiedad.Name != "Id")
                {
                    entidad.Property(propiedad.Name).CurrentValue = nuevoValor;
                    entidad.Property(propiedad.Name).IsModified = true;
                }
            }

            //_context.Cliente.Update(modelo);
            await _context.SaveChangesAsync();
            return modelo;
        }

        public async Task<bool> ObtenerCliente(string identificacion, int? id = null)
        {
            var clienteObj = await _context.Cliente.Where(x => x.Identificacion == identificacion && x.Activo == true).FirstOrDefaultAsync();
            if (clienteObj != null)
            {
                _context.Entry(clienteObj).State = EntityState.Detached;
                if (id != null && clienteObj.Id != id)
                {
                    return false;
                }

                return true;
            }

            return false;
        }

        public async Task<Cliente?> ObtenerClientePorId(int id)
        {
            return await _context.Cliente.Where(x => x.Id == id).FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Cliente>> ObtenerClientes(PeticionLista modelo)
        {
            var consulta = _context.Cliente.AsQueryable();

            if (!string.IsNullOrEmpty(modelo.CampoBuscar))
            {
                consulta = consulta.Where(u => u.Nombre.Contains(modelo.CampoBuscar)
                                      || u.Identificacion.Contains(modelo.CampoBuscar));
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
