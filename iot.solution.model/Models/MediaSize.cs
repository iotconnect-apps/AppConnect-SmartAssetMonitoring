using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace iot.solution.model.Models
{
    [Table("MediaSize")]
    public class MediaSize 
    {
        public MediaSize()
        {
            this.IsDeleted = false;
        }
        [Key]
        [Column("MediaSizeId")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Required]
        public int MediaSizeId { get; set; }

        [Column("MediaSizeName")]
        [StringLength(20)]
        [Required]
        public string MediaSizeName { get; set; }

        [Column("MediaSizeValue")]
        [Required]
        public int MediaSizeValue { get; set; }

        [Column("MediaSizeRatio")]
        [StringLength(20)]
        [Required]
        public string MediaSizeRatio { get; set; }

        [Column("IsDeleted")]
        public Nullable<bool> IsDeleted { get; set; }
    }

}