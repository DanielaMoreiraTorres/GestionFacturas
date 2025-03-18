using FacturasAPI.Dominio;
using FacturasAPI.Dominio.Modelo;

namespace FacturasAPI.Infraestructura.Datos.IRepositorio
{
    public interface IUsuarioRepositorio
    {
        Task<Usuario> ObtenerUsuario(InicioSesion modelo);
        Task<Usuario> ModificarToken(Usuario modelo);
        Task<Usuario> VerificarToken(int id);
    }
}
