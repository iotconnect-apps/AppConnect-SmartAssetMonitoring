DECLARE @dt DATETIME = GETUTCDATE()
IF NOT EXISTS (SELECT TOP 1 1 FROM dbo.[configuration] WHERE [configKey] = 'db-version')
BEGIN
	INSERT [dbo].[Configuration] ([guid], [configKey], [value], [isDeleted], [createdDate], [createdBy], [updatedDate], [updatedBy]) VALUES (N'cf45da4c-1b49-49f5-a5c3-8bc29c1999ea', N'db-version', N'1', 0, CAST(N'2020-04-08T13:16:53.940' AS DateTime), NULL, CAST(N'2020-04-08T13:16:53.940' AS DateTime), NULL)
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
INSERT INTO [dbo].[AdminUser] ([guid],[email],[companyGuid],[firstName],[lastName],[password],[isActive],[isDeleted],[createdDate]) VALUES (NEWID(),'admin@assetmonitoring.com','AB469212-2488-49AD-BC94-B3A3F45590D2','Asset Monitoring','admin','Softweb#123',1,0,GETUTCDATE())

INSERT [dbo].[UserDasboardWidget] ([Guid], [DashboardName], [Widgets], [IsDefault], [IsSystemDefault], [UserId], [IsActive], [IsDeleted], [CreatedDate], [CreatedBy], [ModifiedDate], [ModifiedBy]) VALUES (N'2AFB7737-9F88-4BD1-9447-14D495E40DE0', N'Default Dashboard', N'[]', 0, 1, N'00000000-0000-0000-0000-000000000000', 1, 0, CAST(N'2020-07-06T14:52:39.567' AS DateTime), N'00000000-0000-0000-0000-000000000000', CAST(N'2020-07-06T14:53:09.490' AS DateTime), N'00000000-0000-0000-0000-000000000000')

UPDATE [dbo].[Configuration]
SET [value]  = '1'
WHERE [configKey] = 'db-version'

END

GO