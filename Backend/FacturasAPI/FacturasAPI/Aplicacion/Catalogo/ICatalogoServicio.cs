using FacturasAPI.Dominio.Modelo;

namespace FacturasAPI.Aplicacion.Catalogo
{
    public interface ICatalogoServicio
    {
        Task<Respuesta> CatalogoTipoIdentificacion();
    }
}
