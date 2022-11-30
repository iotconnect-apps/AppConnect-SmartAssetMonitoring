DECLARE @dt DATETIME = GETUTCDATE()
IF NOT EXISTS (SELECT TOP 1 1 FROM dbo.[configuration] WHERE [configKey] = 'db-version')
BEGIN
	INSERT [dbo].[Configuration] ([guid], [configKey], [value], [isDeleted], [createdDate], [createdBy], [updatedDate], [updatedBy]) VALUES (N'cf45da4c-1b49-49f5-a5c3-8bc29c1999ea', N'db-version', N'0', 0, CAST(N'2020-04-08T13:16:53.940' AS DateTime), NULL, CAST(N'2020-04-08T13:16:53.940' AS DateTime), NULL)
END

IF NOT EXISTS (SELECT TOP 1 1 FROM dbo.[configuration] WHERE [configKey] = 'telemetry-last-exectime')
BEGIN
	INSERT [dbo].[Configuration] ([guid], [configKey], [value], [isDeleted], [createdDate], [createdBy], [updatedDate], [updatedBy]) VALUES (N'465970b2-8bc3-435f-af97-8ca26f2bf383', N'telemetry-last-exectime', N'2020-04-25 12:08:02.380', 0, CAST(N'2020-04-25T06:41:01.030' AS DateTime), NULL, CAST(N'2020-04-25T06:41:01.030' AS DateTime), NULL)
END

IF NOT EXISTS (SELECT TOP 1 1 FROM dbo.[configuration] WHERE [configKey] = 'shelfConsuption-last-updatetime')
BEGIN
	INSERT [dbo].[Configuration] ([guid], [configKey], [value], [isDeleted], [createdDate], [createdBy], [updatedDate], [updatedBy]) VALUES (N'594C9530-D7C5-4A62-AAD0-D297414BBB10', N'shelfConsuption-last-updatetime', N'2020-05-25 12:08:02.380', 0, CAST(N'2020-04-25T06:41:01.030' AS DateTime), NULL, CAST(N'2020-04-25T06:41:01.030' AS DateTime), NULL)
END

IF NOT EXISTS (SELECT TOP 1 1 FROM dbo.[configuration] WHERE [configKey] = 'shelfConsuption-frequency')
BEGIN
	INSERT [dbo].[Configuration] ([guid], [configKey], [value], [isDeleted], [createdDate], [createdBy], [updatedDate], [updatedBy]) VALUES (N'7B8C9404-DAA6-4F6E-8268-A07BEF1F0C7D', N'shelfConsuption-frequency', N'05', 0, CAST(N'2020-05-25T06:41:01.030' AS DateTime), NULL, CAST(N'2020-05-25T06:41:01.030' AS DateTime), NULL)
END

IF NOT EXISTS (SELECT TOP 1 1 FROM dbo.[configuration] WHERE [configKey] = 'threshold-limit')
BEGIN
	INSERT [dbo].[Configuration] ([guid], [configKey], [value], [isDeleted], [createdDate], [createdBy], [updatedDate], [updatedBy]) VALUES (N'BC9B95E3-8ADF-4E56-B6A1-128C1BB8ACF6', N'threshold-limit', N'20.00', 0, CAST(N'2020-05-25T06:41:01.030' AS DateTime), NULL, CAST(N'2020-05-25T06:41:01.030' AS DateTime), NULL)
END

DECLARE @DBVersion FLOAT  = 0
SELECT @DBVersion = CONVERT(FLOAT,[value]) FROM dbo.[configuration] WHERE [configKey] = 'db-version'

IF @DBVersion < 1 
BEGIN
INSERT INTO [dbo].[AdminUser] ([guid],[email],[companyGuid],[firstName],[lastName],[password],[isActive],[isDeleted],[createdDate]) VALUES (NEWID(),'admin@assetmonitoring.com','AB469212-2488-49AD-BC94-B3A3F45590D2','Asset Monitoring','admin','tmp#password',1,0,GETUTCDATE())

INSERT [dbo].[UserDasboardWidget] ([Guid], [DashboardName], [Widgets], [IsDefault], [IsSystemDefault], [UserId], [IsActive], [IsDeleted], [CreatedDate], [CreatedBy], [ModifiedDate], [ModifiedBy]) VALUES (N'2AFB7737-9F88-4BD1-9447-14D495E40DE0', N'Default Dashboard', N'[]', 0, 1, N'00000000-0000-0000-0000-000000000000', 1, 0, CAST(N'2020-07-06T14:52:39.567' AS DateTime), N'00000000-0000-0000-0000-000000000000', CAST(N'2020-07-06T14:53:09.490' AS DateTime), N'00000000-0000-0000-0000-000000000000')

UPDATE [dbo].[Configuration]
SET [value]  = '1'
WHERE [configKey] = 'db-version'

END

GO



--MediaSize Table script 


SET IDENTITY_INSERT [dbo].[MediaSize] ON 
	IF NOT EXISTS(SELECT 1 FROM [MediaSize] WHERE [MediaSizeName] = 'Default')
	BEGIN
		INSERT [dbo].[MediaSize] ([MediaSizeId], [MediaSizeName], [MediaSizeValue], [MediaSizeRatio], [IsDeleted]) VALUES (1, N'Default', 1, N'0x0', 0)
	END

	IF NOT EXISTS(SELECT 1 FROM [MediaSize] WHERE [MediaSizeName] = 'Small')
	BEGIN
		INSERT [dbo].[MediaSize] ([MediaSizeId], [MediaSizeName], [MediaSizeValue], [MediaSizeRatio], [IsDeleted]) VALUES (2, N'Small', 2, N'240x240', 0)
	END

	IF NOT EXISTS(SELECT 1 FROM [MediaSize] WHERE [MediaSizeName] = 'Medium')
	BEGIN
		INSERT [dbo].[MediaSize] ([MediaSizeId], [MediaSizeName], [MediaSizeValue], [MediaSizeRatio], [IsDeleted]) VALUES (3, N'Medium', 4, N'600x600', 0)
	END

	IF NOT EXISTS(SELECT 1 FROM [MediaSize] WHERE [MediaSizeName] = 'Large')
	BEGIN
		INSERT [dbo].[MediaSize] ([MediaSizeId], [MediaSizeName], [MediaSizeValue], [MediaSizeRatio], [IsDeleted]) VALUES (4, N'Large', 8, N'1024x1024', 0)
	END

	IF NOT EXISTS(SELECT 1 FROM [MediaSize] WHERE [MediaSizeName] = 'ExtraLarge')
	BEGIN
		INSERT [dbo].[MediaSize] ([MediaSizeId], [MediaSizeName], [MediaSizeValue], [MediaSizeRatio], [IsDeleted]) VALUES (5, N'ExtraLarge', 16, N'1900x1900', 1)
	END

SET IDENTITY_INSERT [dbo].[MediaSize] OFF

SET IDENTITY_INSERT [dbo].[EntityType] ON 
	IF NOT EXISTS(SELECT 1 FROM [EntityType] WHERE [EntityType] = 'Location')
	BEGIN
		INSERT [dbo].[EntityType] ([EntityTypeId], [EntityType], [IsDeleted]) VALUES (1, N'Location', 0)
	END
	IF NOT EXISTS(SELECT 1 FROM [EntityType] WHERE [EntityType] = 'Zone')
	BEGIN
		INSERT [dbo].[EntityType] ([EntityTypeId], [EntityType], [IsDeleted]) VALUES (2, N'Zone', 0)
	END
	IF NOT EXISTS(SELECT 1 FROM [EntityType] WHERE [EntityType] = 'Asset')
	BEGIN
		INSERT [dbo].[EntityType] ([EntityTypeId], [EntityType], [IsDeleted]) VALUES (3, N'Asset', 0)
	END
SET IDENTITY_INSERT [dbo].[EntityType] OFF
GO





IF EXISTS(SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'AppSetting')
BEGIN

		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'SolutionKey')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('SolutionKey','{yoursolutionkey}','Solution Key',0)
		END

		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'EnvironmentCode')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('EnvironmentCode','{IoTConnectEnvironmentCode}','Environment Code',0)
		END

		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'SubscriptionBaseUrl')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('SubscriptionBaseUrl','https://partnerservice.iotconnect.io/connectstudio-api-subscription/api/v1/','Subscription Base Url',0)
		END

		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'SubscriptionClientID')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('SubscriptionClientID','{SubscriptionCliendID}','Subscription Client ID',0)
		END

		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'SubscriptionClientSecret')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('SubscriptionClientSecret','{SubscriptionCliendSecret}','Subscription Client Secret',0)
		END

		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'SubscriptionSolutionCode')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('SubscriptionSolutionCode','{SolutionCode}','Subscription Solution Code',0)
		END

		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'SubscriptionSolutionId')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('SubscriptionSolutionId','{SubscriptionSolutionId}','Subscription Solution Id',0)
		END

		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'SubscriptionUserName')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('SubscriptionUserName','{YourPartnerEmail}','Subscription User Name',0)
		END


		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'MessagingServicebusEndPoint')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('MessagingServicebusEndPoint','{YourServicebusConnectionString}','Messaging Servicebus EndPoint',0)
		END


		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'MessagingTopicName')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('MessagingTopicName','{ServiceBusTopicName}','Messaging Topic Name',0)
		END


		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'MessagingSubscriptionName')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('MessagingSubscriptionName','{ServiceBusSubscriberName}','Messaging Subscription Name',0)
		END

		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'TokenIssuer')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('TokenIssuer','{YourAPIUrl}','Token Issuer',0)
		END

		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'TokenAudience')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('TokenAudience','{YourAPIUrl}','Token Audience',0)
		END

		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'TokenSecurityKey')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('TokenSecurityKey','AssetMonitoring_IOT_Solution','Token Security Key',0)
		END

		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'TokenAuthority')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('TokenAuthority','https://login.iotconnect.io','Token Authority',0)
		END

		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'TokenApiName')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('TokenApiName','iotconnect.api','Token Api Name',0)
		END

		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'TokenApiSecret')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('TokenApiSecret','softweb.secret.api.key','Token Api Secret',0)
		END

		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'TokenEnableCaching')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('TokenEnableCaching','true','Token Enable Caching',0)
		END

		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'TokenCacheDurationMinutes')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('TokenCacheDurationMinutes','5','Token Cache Duration Minutes',0)
		END

		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'TokenRequireHttpsMetadata')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('TokenRequireHttpsMetadata','false','Token Require Https Metadata',0)
		END

		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'LoggerBrokerConnection')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('LoggerBrokerConnection','{LoggingServiceBusConnectionString}','Logger Broker Connection',0)
		END

		
		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'LoggerSolutionName')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('LoggerSolutionName','AssetMonitoring','Logger Solution Name',0)
		END

		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'HangFireEnabled')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('HangFireEnabled','true','HangFire Enabled',0)
		END

		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'HangFireTelemetryHours')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('HangFireTelemetryHours','1','HangFire Telemetry Hours',0)
		END

		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'SmtpHost')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('SmtpHost','smtp.sendgrid.net','Smtp Host',0)
		END

		
		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'SmtpPort')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('SmtpPort','587','Smtp Port',0)
		END

		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'SmtpUserName')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('SmtpUserName','apikey','Smtp UserName',0)
		END

		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'SmtpFromMail')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('SmtpFromMail','no-reply@iotconnect.io','Smtp From Mail',0)
		END

		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'SmtpFromDisplayName')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('SmtpFromDisplayName','Smart Asset Monitoring','Smtp From Display Name',0)
		END

		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'SmtpPassword')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('SmtpPassword','{YourSendGridKey}','Smtp Password',0)
		END

		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'SmtpRegards')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('SmtpRegards','Smart Asset Monitoring','Smtp Regards',0)
		END

		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'EmailTemplateCompanyRegistrationSubject')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('EmailTemplateCompanyRegistrationSubject','Smart Asset Monitoring : Company Registered','Email Template Company Registration Subject',0)
		END

		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'EmailTemplateCompanyUserList')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('EmailTemplateCompanyUserList','{YourEmailAddress}','Email Template Company User List',0)
		END

		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'EmailTemplateCompanyAdminUserList')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('EmailTemplateCompanyAdminUserList','{YourEmailAddress}','Email Template Company Admin User List',0)
		END

		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'EmailTemplateSubscriptionExpirySubject')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('EmailTemplateSubscriptionExpirySubject','Smart Asset Monitoring : User Subscription Expiry','Email Template Subscription Expiry Subject',0)
		END

		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'EmailTemplateSubscriptionExpiryUserList')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('EmailTemplateSubscriptionExpiryUserList','{YourEmailAddress}','Email Template Subscription Expiry User List',0)
		END
		

		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'PortalUrl')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('PortalUrl','{YourPortalURL}','Email Template Image Base Url',0)
		END

		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'EmailTemplateMailSolutionName')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('EmailTemplateMailSolutionName','smart asset monitoring','Email Template Mail Solution Name',0)
		END


			IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'MediaAzureConnectionString')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('MediaAzureConnectionString','{YourBlobStorageConnectionString}','Media Azure ConnectionString',0)
		END

			IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'MediaTimeoutMinutes')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('MediaTimeoutMinutes','5000','Media Timeout Minutes',0)
		END

		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'MediaBlobContainerName')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('MediaBlobContainerName','smartassetmonitoring','Media Blob Container Name',0)
		END

		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'AzureFun_GenerateImageURL')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('AzureFun_GenerateImageURL','{yourazurefunctionGenerateImageURL}','Azure Function GenerateImageURL',0)
		END

		IF NOT EXISTS(SELECT * FROM AppSetting WHERE [key] = 'AzureFun_DeleteImageURL')
		BEGIN
			INSERT INTO [dbo].[AppSetting] ([Key],[Value],[Description],[Preference]) VALUES ('AzureFun_DeleteImageURL','yourazurefunctionDeleteImageURL','Azure Function DeleteImageURL',0)
		END

END


--Document related script--

SET IDENTITY_INSERT [dbo].[DocumentType] ON 
	IF NOT EXISTS(SELECT 1 FROM [DocumentType] WHERE [DocumentType] = 'AssetMedia')
	BEGIN
		INSERT [dbo].[DocumentType] ([DocumentTypeId], [DocumentType], [IsDeleted]) VALUES (1, N'AssetMedia', 0)
	END
SET IDENTITY_INSERT [dbo].[DocumentType] OFF
GO


