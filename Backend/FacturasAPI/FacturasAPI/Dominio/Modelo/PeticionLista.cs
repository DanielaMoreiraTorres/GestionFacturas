namespace FacturasAPI.Dominio.Modelo
{
    public class PeticionLista
    {
        public int Pagina { get; set; } = 1;
        public int TamanoPagina { get; set; } = 5;
        public string? CampoBuscar { get; set; }
        public string? CampoOrdenar { get; set; }
        public string? DireccionOrdenar { get; set; }
        public string? CampoFiltro { get; set; }
    }
}
