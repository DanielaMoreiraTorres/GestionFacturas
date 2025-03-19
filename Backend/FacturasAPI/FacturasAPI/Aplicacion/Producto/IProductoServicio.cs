using FacturasAPI.Dominio.Modelo;

namespace FacturasAPI.Aplicacion.Producto
{
    public interface IProductoServicio
    {
        Task<Respuesta> Listar(PeticionLista modelo);
        Task<Respuesta> Agregar(Dominio.Producto modelo);
        Task<Respuesta> Modificar(int id, Dominio.Producto modelo);
        Task<Respuesta> Eliminar(int id);
        Task<Respuesta> Obtener(int id);
    }
}
