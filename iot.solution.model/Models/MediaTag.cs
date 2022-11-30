using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace iot.solution.model.Models
{
    [Table("MediaTag")]
    public class MediaTags 
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("MediaTagId")]
        public System.Guid MediaTagId { get; set; }

        [Column("MediaTag")]
        public string MediaTag { get; set; }

        [Column("IsDeleted")]
        public bool IsDeleted { get; set; }
    }
}
