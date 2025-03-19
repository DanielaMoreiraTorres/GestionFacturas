using FacturasAPI.Dominio.Modelo;
using FacturasAPI.Dominio;

namespace FacturasAPI.Infraestructura.Datos.IRepositorio
{
    public interface IClienteRepositorio
    {
        Task<IEnumerable<Cliente>> ObtenerClientes(PeticionLista modelo);
        Task<Cliente> AgregarCliente(Cliente modelo);
        Task<Cliente> ModificarCliente(Cliente modelo);
        Task<Cliente> EliminarCliente(Cliente modelo);
        Task<bool> ExisteCliente(int id);
        Task<Cliente?> ObtenerClientePorId(int id);
        Task<bool> ObtenerCliente(string identificacion, int? id = null);
    }
}
