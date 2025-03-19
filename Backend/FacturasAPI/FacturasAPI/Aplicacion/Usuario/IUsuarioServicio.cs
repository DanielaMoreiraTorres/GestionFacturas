using FacturasAPI.Dominio.Modelo;

namespace FacturasAPI.Aplicacion.Usuario
{
    public interface IUsuarioServicio
    {
        Task<Respuesta> InicioSesion(InicioSesion modelo);
        Task<Respuesta> VerificarToken(int usuarioId, string cabeceraAutenticacion);
        Task<Respuesta> Listar(PeticionLista modelo);
        Task<Respuesta> Agregar(Dominio.Usuario modelo);
        Task<Respuesta> Modificar(int id, Dominio.Usuario modelo);
        Task<Respuesta> Eliminar(int id);
        Task<Respuesta> Obtener(int id);
    }
}
