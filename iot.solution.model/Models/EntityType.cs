using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace iot.solution.model.Models
{
    [Table("EntityType")]
    public class EntityType 
    {
        [Key]
        [Column("EntityTypeId")]
        public int EntityTypeId { get; set; }

        [Column("EntityType")]
        public string Type { get; set; }

        [Column("IsDeleted")]
        public bool IsDeleted { get; set; }
    }
}
