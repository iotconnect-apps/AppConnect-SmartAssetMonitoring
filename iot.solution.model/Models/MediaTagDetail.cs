using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace iot.solution.model.Models
{
    [Table("MediaTagDetail")]
    public class MediaTagDetail 
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("MediaTagDetailId")]
        public System.Guid MediaTagDetailId { get; set; }

        [Column("MediaTagId")]
        public System.Guid MediaTagId { get; set; }

        [Column("MediaId")]
        public System.Guid MediaId { get; set; }
    }
}
