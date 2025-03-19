using FacturasAPI.Dominio;
using FacturasAPI.Dominio.Modelo;

namespace FacturasAPI.Infraestructura.Datos.IRepositorio
{
    public interface IUsuarioRepositorio
    {
        Task<Usuario> ObtenerUsuario(InicioSesion modelo);
        Task<Usuario> ModificarToken(Usuario modelo);
        Task<Usuario> VerificarToken(int id);
        Task<IEnumerable<UsuarioTabla>> ObtenerUsuarios(PeticionLista modelo);
        Task<Usuario> AgregarUsuario(Usuario modelo);
        Task<Usuario> ModificarUsuario(Usuario modelo);
        Task<Usuario> EliminarUsuario(Usuario modelo);
        Task<bool> ExisteUsuario(int id);
        Task<Usuario> ObtenerUsuarioPorId(int id);
        Task<bool> ObtenerUsuario(string usuario, int? id = null);
    }
}
