using FacturasAPI.Dominio.Modelo;
using FacturasAPI.Dominio;

namespace FacturasAPI.Infraestructura.Datos.IRepositorio
{
    public interface IProductoRepositorio
    {
        Task<IEnumerable<Producto>> ObtenerProductos(PeticionLista modelo);
        Task<Producto> AgregarProducto(Producto modelo);
        Task<Producto> ModificarProducto(Producto modelo);
        Task<Producto> EliminarProducto(Producto modelo);
        Task<bool> ExisteProducto(int id);
        Task<Producto?> ObtenerProductoPorId(int id);
        Task<bool> ObtenerProducto(string codigo, int? id = null);
    }
}
