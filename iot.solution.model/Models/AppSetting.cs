
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace iot.solution.model.Models
{
    [Table("AppSetting")]
    public class AppSetting
    {
        /// <summary>
        /// Gets or sets the application setting identifier.
        /// </summary>
        /// <value>
        /// The application setting identifier.
        /// </value>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("AppSettingId")]
        public int AppSettingId { get; set; }

        /// <summary>
        /// Gets or sets the key.
        /// </summary>
        /// <value>
        /// The key.
        /// </value>
        [Column("Key")]
        public string Key { get; set; }

        /// <summary>
        /// Gets or sets the value.
        /// </summary>
        /// <value>
        /// The value.
        /// </value>
        [Column("Value")]
        public string Value { get; set; }

        /// <summary>
        /// Gets or sets the description.
        /// </summary>
        /// <value>
        /// The description.
        /// </value>
        [Column("Description")]
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the preference.
        /// </summary>
        /// <value>
        /// The preference.
        /// </value>
        [Column("Preference")]
        public int Preference { get; set; }
    }
}
