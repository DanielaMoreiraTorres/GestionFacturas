using FacturasAPI.Dominio;

namespace FacturasAPI.Infraestructura.Datos.IRepositorio
{
    public interface ICatalogoRepositorio
    {
        Task<IEnumerable<TipoIdentificacion>> ObtenerCatalogoTipoIdentificacion();
    }
}
