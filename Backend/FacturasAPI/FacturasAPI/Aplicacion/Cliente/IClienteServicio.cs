using FacturasAPI.Dominio.Modelo;

namespace FacturasAPI.Aplicacion.Cliente
{
    public interface IClienteServicio
    {
        Task<Respuesta> Listar(PeticionLista modelo);
        Task<Respuesta> Agregar(Dominio.Cliente modelo);
        Task<Respuesta> Modificar(int id, Dominio.Cliente modelo);
        Task<Respuesta> Eliminar(int id);
        Task<Respuesta> Obtener(int id);
    }
}
