using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace iot.solution.model.Models
{
    [Table("MediaDetail")]
    public class MediaDetail 
    {
        public MediaDetail()
        {
            this.MediaDetailId = Guid.NewGuid();
        }

        [Key]
        [Column("MediaDetailId")]
        [Required]
        public Guid MediaDetailId { get; set; }

        [Column("MediaId")]
        [Required]
        public Guid MediaId { get; set; }

        [Column("MediaSizeId")]
        [Required]
        public int MediaSizeId { get; set; }

        [Column("BlobFile")]
        public string BlobFile { get; set; }

        [Column("Format")]
        [StringLength(150)]
        public string Format { get; set; }

        [Column("width")]
        public Nullable<int> Width { get; set; }

        [Column("height")]
        public Nullable<int> Height { get; set; }

        [Column("size")]
        public Nullable<int> Size { get; set; }
    }
}
