using System.ComponentModel;

namespace iot.solution.common
{
    /// <summary>
    /// AuthenticationErrorCode
    /// </summary>
    public enum AuthenticationErrorCode
    {
        /// <summary>
        /// The access denied
        /// </summary>
        [Description("A0x001")]
        AccessDenied = 1,

        /// <summary>
        /// The unauthorized user
        /// </summary>
        [Description("A0x002")]
        UnauthorizedUser = 2,

        /// <summary>
        /// The invalid API key
        /// </summary>
        [Description("A0x003")]
        InvalidAPIKey = 3,

        /// <summary>
        /// The token expired
        /// </summary>
        [Description("A0x004")]
        TokenExpired = 4,
    }

    /// <summary>
    /// BusinessErrorCode
    /// </summary>
    public enum BusinessErrorCode
    {
        /// <summary>
        /// The success
        /// </summary>
        [Description("B0x001")]
        Success = 1,

        /// <summary>
        /// The entity can not be empty
        /// </summary>
        [Description("B0x002")]
        EntityCanNotBeEmpty = 2,

        /// <summary>
        /// The invalid entity
        /// </summary>
        [Description("B0x003")]
        InvalidEntity = 3,

        /// <summary>
        /// The request can not be null
        /// </summary>
        [Description("B0x004")]
        RequestCanNotBeNull = 4,

        /// <summary>
        /// The operational error
        /// </summary>
        [Description("B0x005")]
        OperationalError = 5,

        /// <summary>
        /// The created
        /// </summary>
        [Description("B0x006")]
        Created = 6,

        /// <summary>
        /// The updated
        /// </summary>
        [Description("B0x007")]
        Updated = 7,

        /// <summary>
        /// The deleted
        /// </summary>
        [Description("B0x008")]
        Deleted = 8,

        /// <summary>
        /// The no content
        /// </summary>
        [Description("B0x009")]
        NoContent = 9,

        /// <summary>
        /// The invalid data
        /// </summary>
        [Description("B0x010")]
        InvalidData = 10,

        /// <summary>
        /// The invalid length
        /// </summary>
        [Description("B0x011")]
        InvalidLength = 11,
    }

    /// <summary>
    /// DatabaseErrorCode
    /// </summary>
    public enum DatabaseErrorCode
    {
        /// <summary>
        /// The entity already exists
        /// </summary>
        [Description("D0x001")]
        EntityAlreadyExists = 1,

        /// <summary>
        /// The no data found
        /// </summary>
        [Description("D0x002")]
        NoDataFound = 2,

        /// <summary>
        /// The invalid data
        /// </summary>
        [Description("D0x003")]
        InvalidData = 3,

        /// <summary>
        /// The can not delete
        /// </summary>
        [Description("D0x004")]
        CanNotDelete = 4,

        /// <summary>
        /// The duplicate data
        /// </summary>
        [Description("D0x005")]
        DuplicateData = 5
    }

    /// <summary>
    /// GeneralErrorCode
    /// </summary>
    public enum GeneralErrorCode
    {
        /// <summary>
        /// The HTTP version not supported
        /// </summary>
        [Description("C0x001")]
        HttpVersionNotSupported = 1,

        /// <summary>
        /// The request timeout
        /// </summary>
        [Description("C0x002")]
        RequestTimeout = 2,

        /// <summary>
        /// The bad request
        /// </summary>
        [Description("C0x003")]
        BadRequest = 3,

        /// <summary>
        /// The configuration missing
        /// </summary>
        [Description("C0x004")]
        ConfigurationMissing = 4,

        /// <summary>
        /// The third party service not available
        /// </summary>
        [Description("C0x005")]
        ThirdPartyServiceNotAvailable = 5,

        /// <summary>
        /// The third party service not implemented
        /// </summary>
        [Description("C0x006")]
        ThirdPartyServiceNotImplemented = 6,

        /// <summary>
        /// The third party operation fail error
        /// </summary>
        [Description("C0x007")]
        ThirdPartyOperationFailError = 7,

        /// <summary>
        /// The third party service token null
        /// </summary>
        [Description("C0x008")]
        ThirdPartyServiceTokenNull = 8,
    }

    public enum AppSettingKey
    {

        [Description("SolutionKey")]
        SolutionKey,

        [Description("EnvironmentCode")]
        EnvironmentCode,

        [Description("SubscriptionBaseUrl")]
        SubscriptionBaseUrl,

        [Description("SubscriptionClientID")]
        SubscriptionClientID,

        [Description("SubscriptionClientSecret")]
        SubscriptionClientSecret,

        [Description("SubscriptionSolutionCode")]
        SubscriptionSolutionCode,

        [Description("SubscriptionSolutionId")]
        SubscriptionSolutionId,

        [Description("SubscriptionUserName")]
        SubscriptionUserName,

        [Description("MessagingServicebusEndPoint")]
        MessagingServicebusEndPoint,

        [Description("MessagingTopicName")]
        MessagingTopicName,

        [Description("MessagingSubscriptionName")]
        MessagingSubscriptionName,

        [Description("TokenIssuer")]
        TokenIssuer,

        [Description("TokenAudience")]
        TokenAudience,

        [Description("TokenSecurityKey")]
        TokenSecurityKey,

        [Description("TokenAuthority")]
        TokenAuthority,

        [Description("TokenApiName")]
        TokenApiName,

        [Description("TokenApiSecret")]
        TokenApiSecret,

        [Description("TokenEnableCaching")]
        TokenEnableCaching,

        [Description("TokenCacheDurationMinutes")]
        TokenCacheDurationMinutes,

        [Description("TokenRequireHttpsMetadata")]
        TokenRequireHttpsMetadata,

        [Description("LoggerBrokerConnection")]
        LoggerBrokerConnection,

        [Description("LoggerSolutionName")]
        LoggerSolutionName,

        [Description("HangFireEnabled")]
        HangFireEnabled,

        [Description("HangFireTelemetryHours")]
        HangFireTelemetryHours,

        [Description("SmtpHost")]
        SmtpHost,

        [Description("SmtpPort")]
        SmtpPort,

        [Description("SmtpUserName")]
        SmtpUserName,

        [Description("SmtpFromMail")]
        SmtpFromMail,

        [Description("SmtpFromDisplayName")]
        SmtpFromDisplayName,

        [Description("SmtpPassword")]
        SmtpPassword,

        [Description("SmtpRegards")]
        SmtpRegards,

        [Description("EmailTemplateCompanyRegistrationSubject")]
        EmailTemplateCompanyRegistrationSubject,

        [Description("EmailTemplateCompanyUserList")]
        EmailTemplateCompanyUserList,

        [Description("EmailTemplateCompanyAdminUserList")]
        EmailTemplateCompanyAdminUserList,

        [Description("EmailTemplateSubscriptionExpirySubject")]
        EmailTemplateSubscriptionExpirySubject,

        [Description("EmailTemplateSubscriptionExpiryUserList")]
        EmailTemplateSubscriptionExpiryUserList,

        [Description("PortalUrl")]
        PortalUrl,

        [Description("EmailTemplateMailSolutionName")]
        EmailTemplateMailSolutionName,

        [Description("MediaAzureConnectionString")]
        MediaAzureConnectionString,

        [Description("MediaTimeoutMinutes")]
        MediaTimeoutMinutes,

        [Description("MediaBlobContainerName")]
        MediaBlobContainerName,

        [Description("AzureFun_GenerateImageURL")]
        AzureFun_GenerateImageURL,

        [Description("AzureFun_DeleteImageURL")]
        AzureFun_DeleteImageURL,

    }


    public enum MediaSize
    {
        Default = 1,
        Small = 2,
        Medium = 4,
        Large = 8,
        ExtraLarge = 16
    }


    public enum EntityTypeEnum
    {
        Location = 1,
        Zone = 2,
        Asset = 3,
    }


    public enum DocumentTypeEnum
    {
        AssetMedia = 1
    }

}
