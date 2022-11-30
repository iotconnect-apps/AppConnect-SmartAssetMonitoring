using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace iot.solution.model.Models
{
    [Table("Media")]
    public class Medias 
    {
        public Medias()
        {
            this.MediaId = Guid.NewGuid();
            this.CreatedDate = DateTime.UtcNow;
        }

        [Key]
        [Column("MediaId")]
        [Required]
        public Guid MediaId { get; set; }

        [Column("EntityTypeId")]
        [Required]
        public int EntityTypeId { get; set; }

        [Column("EntityTypeValue")]
        [StringLength(150)]
        [Required]
        public string EntityTypeValue { get; set; }

        [Column("Type")]
        [Required]
        public int Type { get; set; }

        [Column("Tag")]
        [StringLength(150)]
        public string Tag { get; set; }

        [Column("Title")]
        [StringLength(250)]
        public string Title { get; set; }

        [Column("Description")]
        public string Description { get; set; }

        [Column("CreatedDate")]
        public Nullable<DateTime> CreatedDate { get; set; }

        [Column("CreatedBy")]
        public Nullable<Guid> CreatedBy { get; set; }

        [Column("ModifyDate")]
        public Nullable<DateTime> ModifyDate { get; set; }

        [Column("ModifyBy")]
        public Nullable<Guid> ModifyBy { get; set; }

        //[Column("Coordinate")]
        //public string Coordinate { get; set; }

        // [Column("ZoomRatio")]
        // public string ZoomRatio { get; set; }

        [NotMapped]
        public List<MediaDetail> MediaDetail { get; set; }

        [NotMapped]
        public string Size { get; set; }

        [Column("OrderNumber")]
        public int OrderNumber { get; set; }
    }
}
