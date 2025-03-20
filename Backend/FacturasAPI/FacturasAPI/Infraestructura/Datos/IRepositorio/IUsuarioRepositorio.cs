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
        Task<UsuarioModelo> AgregarUsuario(Usuario modelo);
        Task<UsuarioModelo> ModificarUsuario(Usuario modelo);
        Task<UsuarioModelo> EliminarUsuario(Usuario modelo);
        Task<bool> ExisteUsuario(int id);
        Task<Usuario?> ObtenerUsuarioPorId(int id);
        Task<bool> ObtenerUsuario(string usuario, int? id = null);
    }
}
