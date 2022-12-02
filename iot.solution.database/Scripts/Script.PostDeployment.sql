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

INSERT [dbo].[UserDasboardWidget] ([Guid], [DashboardName], [Widgets], [IsDefault], [IsSystemDefault], [UserId], [IsActive], [IsDeleted], [CreatedDate], [CreatedBy], [ModifiedDate], [ModifiedBy]) VALUES (N'2AFB7737-9F88-4BD1-9447-14D495E40DE0', N'Default Dashboard', N'[{"id":"21a11977-c554-40df-892d-a65d9dd38935","name":"Total Locations","type":"counter","componentName":"widget-counter-a","cols":23,"rows":8,"x":0,"y":0,"properties":{"w":460,"h":160,"sm":{"minWSm":400,"minHSm":160,"maxHSm":480,"maxWSm":1200},"md":{"minWMd":400,"minHMd":160,"maxHMd":480,"maxWMd":1200},"lg":{"minWLg":400,"minHLg":160,"maxHLg":480,"maxWLg":1200},"minItemCols":1,"maxItemCols":1,"minItemRows":1,"maxItemRows":1,"moveEnabled":"true","dragEnabled":"true","resizeEnabled":"true","isStatic":"false","className":"widgets-list widbg3"},"widgetProperty":{"chartType":null,"chartColor":[],"icon":"","alertLimit":0,"background":"#80dceb","fontColor":"#000","fontFamily":"Arial, Helvetica, sans-serif","fontSize":16,"title":"Total Locations","markers":[],"zoom":10,"contents":{"entities":{"fontColor":"#000","fontFamily":"Arial, Helvetica, sans-serif","fontSize":16,"title":"Total Locations","contentTitle":"Entities"},"count":{"fontColor":"#000","fontFamily":"Arial, Helvetica, sans-serif","fontSize":28,"contentTitle":"Entity Count"},"icon":{"isRequired":true,"iconClass":"fas fa-map-marker","fontSize":3,"fontColor":"#000"}}},"minItemRows":8,"maxItemRows":24,"minItemCols":20,"maxItemCols":60},{"id":"3a419938-9565-409f-a77b-084b503106e1","name":"Total Zones","type":"counter","componentName":"widget-counter-b","cols":23,"rows":8,"x":24,"y":0,"properties":{"w":460,"h":160,"sm":{"minWSm":400,"minHSm":160,"maxHSm":480,"maxWSm":1200},"md":{"minWMd":400,"minHMd":160,"maxHMd":480,"maxWMd":1200},"lg":{"minWLg":400,"minHLg":160,"maxHLg":480,"maxWLg":1200},"minItemCols":1,"maxItemCols":1,"minItemRows":1,"maxItemRows":1,"moveEnabled":"true","dragEnabled":"true","resizeEnabled":"true","isStatic":"false","className":"widgets-list widbg3"},"widgetProperty":{"chartType":null,"chartColor":[],"icon":"","alertLimit":0,"background":"#41c363","fontColor":"#000","fontFamily":"Arial, Helvetica, sans-serif","fontSize":16,"title":"Total Zones","markers":[],"zoom":10,"contents":{"entities":{"fontColor":"#000","fontFamily":"Arial, Helvetica, sans-serif","fontSize":16,"title":"Total Zones","contentTitle":"Entities"},"count":{"fontColor":"#000","fontFamily":"Arial, Helvetica, sans-serif","fontSize":28,"contentTitle":"Entity Count"},"icon":{"isRequired":true,"iconClass":"fas fa-chart-pie","fontSize":3,"fontColor":"#000"}}},"minItemRows":8,"maxItemRows":24,"minItemCols":20,"maxItemCols":60},{"id":"afd594ec-c7ea-4ac4-981f-6207dbae4c4a","name":"Asset Types","type":"counter","componentName":"widget-counter-c","cols":21,"rows":8,"x":48,"y":0,"properties":{"w":420,"h":160,"sm":{"minWSm":400,"minHSm":160,"maxHSm":480,"maxWSm":1200},"md":{"minWMd":400,"minHMd":160,"maxHMd":480,"maxWMd":1200},"lg":{"minWLg":400,"minHLg":160,"maxHLg":480,"maxWLg":1200},"minItemCols":1,"maxItemCols":1,"minItemRows":1,"maxItemRows":1,"moveEnabled":"true","dragEnabled":"true","resizeEnabled":"true","isStatic":"false","className":"widgets-list widbg3"},"widgetProperty":{"chartType":null,"chartColor":[],"icon":"","alertLimit":0,"background":"#ffd100","fontColor":"#919191","fontFamily":"Arial, Helvetica, sans-serif","fontSize":16,"title":"Asset Types","markers":[],"zoom":10,"contents":{"entities":{"fontColor":"#000","fontFamily":"Arial, Helvetica, sans-serif","fontSize":16,"title":"Asset Types","contentTitle":"Entities"},"count":{"fontColor":"#000","fontFamily":"Arial, Helvetica, sans-serif","fontSize":28,"contentTitle":"Entity Count"},"icon":{"isRequired":true,"iconClass":"fas fa-list-alt","fontSize":3,"fontColor":"#000"}}},"minItemRows":8,"maxItemRows":24,"minItemCols":20,"maxItemCols":60},{"id":"1d1d809f-1d38-44ff-a16a-e8aee4484f27","name":"Assets","type":"counter","componentName":"widget-counter-d","cols":23,"rows":8,"x":0,"y":9,"properties":{"w":460,"h":160,"sm":{"minWSm":400,"minHSm":160,"maxHSm":480,"maxWSm":1200},"md":{"minWMd":400,"minHMd":160,"maxHMd":480,"maxWMd":1200},"lg":{"minWLg":400,"minHLg":160,"maxHLg":480,"maxWLg":1200},"minItemCols":1,"maxItemCols":1,"minItemRows":1,"maxItemRows":1,"moveEnabled":"true","dragEnabled":"true","resizeEnabled":"true","isStatic":"false","className":"widgets-list widbg3"},"widgetProperty":{"chartType":null,"chartColor":[],"icon":"","alertLimit":0,"background":"#919191","fontColor":"#000","fontFamily":"Arial, Helvetica, sans-serif","fontSize":16,"title":"Assets","markers":[],"zoom":10,"contents":{"entities":{"fontColor":"#000","fontFamily":"Arial, Helvetica, sans-serif","fontSize":16,"title":"Assets","contentTitle":"Entities"},"count":{"fontColor":"#000","fontFamily":"Arial, Helvetica, sans-serif","fontSize":28,"contentTitle":"Entity Count"},"icon":{"isRequired":true,"iconClass":"fas fa-microscope","fontSize":3,"fontColor":"#000"}}},"minItemRows":8,"maxItemRows":24,"minItemCols":20,"maxItemCols":60},{"id":"6657c361-0d84-4b2a-8421-89ddba79205e","name":"Alerts (This Month)","type":"counter","componentName":"widget-counter-e","cols":23,"rows":8,"x":24,"y":9,"properties":{"w":460,"h":160,"sm":{"minWSm":400,"minHSm":160,"maxHSm":480,"maxWSm":1200},"md":{"minWMd":400,"minHMd":160,"maxHMd":480,"maxWMd":1200},"lg":{"minWLg":400,"minHLg":160,"maxHLg":480,"maxWLg":1200},"minItemCols":1,"maxItemCols":1,"minItemRows":1,"maxItemRows":1,"moveEnabled":"true","dragEnabled":"true","resizeEnabled":"true","isStatic":"false","className":"widgets-list widbg3"},"widgetProperty":{"chartType":null,"chartColor":[],"icon":"","alertLimit":0,"background":"#d2d2d2","fontColor":"#000","fontFamily":"Arial, Helvetica, sans-serif","fontSize":16,"title":"Alerts (This Month)","markers":[],"zoom":10,"contents":{"entities":{"fontColor":"#000","fontFamily":"Arial, Helvetica, sans-serif","fontSize":16,"title":"Alerts (This Month)","contentTitle":"Entities"},"count":{"fontColor":"#000","fontFamily":"Arial, Helvetica, sans-serif","fontSize":28,"contentTitle":"Entity Count"},"icon":{"isRequired":true,"iconClass":"fas fa-bell","fontSize":3,"fontColor":"#000"}}},"minItemRows":8,"maxItemRows":24,"minItemCols":20,"maxItemCols":60},{"id":"958f12b8-859e-47c5-9392-14b274294185","name":"Maintenance (This Month)","type":"counter","componentName":"widget-counter-f","cols":21,"rows":8,"x":48,"y":9,"properties":{"w":420,"h":160,"sm":{"minWSm":400,"minHSm":160,"maxHSm":480,"maxWSm":1200},"md":{"minWMd":400,"minHMd":160,"maxHMd":480,"maxWMd":1200},"lg":{"minWLg":400,"minHLg":160,"maxHLg":480,"maxWLg":1200},"minItemCols":1,"maxItemCols":1,"minItemRows":1,"maxItemRows":1,"moveEnabled":"true","dragEnabled":"true","resizeEnabled":"true","isStatic":"false","className":"widgets-list widbg3"},"widgetProperty":{"chartType":null,"chartColor":[],"icon":"","alertLimit":0,"background":"#e77800","fontColor":"#000","fontFamily":"Arial, Helvetica, sans-serif","fontSize":16,"title":"Maintenance (This Month)","markers":[],"zoom":10,"contents":{"entities":{"fontColor":"#000","fontFamily":"Arial, Helvetica, sans-serif","fontSize":14,"title":"Maintenance (This Month)","contentTitle":"Entities"},"count":{"fontColor":"#000","fontFamily":"Arial, Helvetica, sans-serif","fontSize":24,"contentTitle":"Entity Count"},"entitiesIcon":{"isRequired":true,"iconClass":"fas fa-cogs","fontSize":2,"fontColor":"#000"},"active":{"fontColor":"#000","fontFamily":"Arial, Helvetica, sans-serif","fontSize":14,"title":"Under Maintenance","contentTitle":"Entities"},"activeCount":{"fontColor":"#000","fontFamily":"Arial, Helvetica, sans-serif","fontSize":24,"contentTitle":"Entity Count"},"inactive":{"fontColor":"#000","fontFamily":"Arial, Helvetica, sans-serif","fontSize":14,"title":"Scheduled Maintenance","contentTitle":"Entities"},"inactiveCount":{"fontColor":"#000","fontFamily":"Arial, Helvetica, sans-serif","fontSize":24,"contentTitle":"Entity Count"}}},"minItemRows":8,"maxItemRows":24,"minItemCols":20,"maxItemCols":60},{"id":"6ab91243-119a-405b-9a92-ff940eb1d263","name":"Statistics By Location","type":"counter","componentName":"widget-counter-h","cols":41,"rows":18,"x":0,"y":18,"properties":{"w":820,"h":360,"sm":{"minWSm":820,"minHSm":370,"maxHSm":370,"maxWSm":820},"md":{"minWMd":820,"minHMd":370,"maxHMd":370,"maxWMd":820},"lg":{"minWLg":820,"minHLg":370,"maxHLg":370,"maxWLg":820},"minItemCols":1,"maxItemCols":1,"minItemRows":1,"maxItemRows":1,"moveEnabled":"true","dragEnabled":"true","resizeEnabled":"true","isStatic":"false","className":"widgets-list widbg3"},"widgetProperty":{"chartType":null,"chartColor":[],"icon":"","alertLimit":0,"background":"#d2d2d2","fontColor":"#000","fontFamily":"Arial, Helvetica, sans-serif","fontSize":20,"title":"Statistics By Location","markers":[],"zoom":10,"contents":{"entities":{"fontColor":"#000","fontFamily":"Arial, Helvetica, sans-serif","fontSize":20,"title":"Statistics By Location","contentTitle":"Entities"},"count":{"fontColor":"#000","fontFamily":"Arial, Helvetica, sans-serif","fontSize":28,"contentTitle":"Entity Count"},"icon":{"isRequired":true,"iconClass":"fas fa-list-alt","fontSize":3,"fontColor":"#000"}}},"minItemRows":18,"maxItemRows":18,"minItemCols":41,"maxItemCols":41},{"id":"b603a92c-2743-4e38-bedd-a21fc0740a99","name":"Alerts","type":"alert","componentName":"widget-alert-a","cols":27,"rows":18,"x":42,"y":18,"properties":{"w":540,"h":360,"sm":{"minWSm":390,"minHSm":370,"maxHSm":1000,"maxWSm":1000},"md":{"minWMd":390,"minHMd":370,"maxHMd":1000,"maxWMd":1000},"lg":{"minWLg":390,"minHLg":370,"maxHLg":1000,"maxWLg":1000},"minItemCols":1,"maxItemCols":1,"minItemRows":1,"maxItemRows":1,"moveEnabled":"true","dragEnabled":"true","resizeEnabled":"true","isStatic":"false","className":"widgets-list widbg3"},"widgetProperty":{"chartType":null,"chartColor":[],"icon":"","alertLimit":10,"background":"#d2d2d2","fontColor":"#000","fontFamily":"Arial, Helvetica, sans-serif","fontSize":20,"title":"Alerts","markers":[],"zoom":10,"contents":{"entities":{"fontColor":"#000","fontFamily":"Arial, Helvetica, sans-serif","fontSize":16,"title":"Entities","contentTitle":"Entities"},"count":{"fontColor":"#000","fontFamily":"Arial, Helvetica, sans-serif","fontSize":16,"contentTitle":"Entity Count"}}},"minItemRows":18,"maxItemRows":50,"minItemCols":19,"maxItemCols":50},{"id":"27c11cf0-c0e1-4f83-b9a8-c18d25215cc8","name":"Asset Utilization","type":"chart","componentName":"widget-chart-a","cols":17,"rows":21,"x":0,"y":37,"properties":{"w":340,"h":420,"sm":{"minWSm":320,"minHSm":405,"maxHSm":1220,"maxWSm":960},"md":{"minWMd":320,"minHMd":405,"maxHMd":1220,"maxWMd":960},"lg":{"minWLg":320,"minHLg":405,"maxHLg":1220,"maxWLg":960},"minItemCols":1,"maxItemCols":1,"minItemRows":1,"maxItemRows":1,"moveEnabled":"true","dragEnabled":"true","resizeEnabled":"true","isStatic":"false","className":"widgets-list widbg3"},"widgetProperty":{"chartTypeHours":"bar","chartTypeEnergy":"line","chartColor":[{"color":"#40c263"}],"icon":"","alertLimit":0,"background":"#d2d2d2","fontColor":"#000","fontFamily":"Arial, Helvetica, sans-serif","fontSize":20,"title":"Asset Utilization","markers":[],"zoom":10,"contents":{"entities":{"fontColor":"#000","fontFamily":"Arial, Helvetica, sans-serif","fontSize":16,"title":"Asset Utilization","contentTitle":"Entities"},"count":{"fontColor":"#000","fontFamily":"Arial, Helvetica, sans-serif","fontSize":16,"contentTitle":"Entity Count"}}},"minItemRows":20,"maxItemRows":61,"minItemCols":16,"maxItemCols":48},{"id":"a0011e2a-6a84-4edf-93b8-d1bf7791c330","name":"Usage by Asset Type","type":"chart","componentName":"widget-chart-c","cols":23,"rows":21,"x":18,"y":37,"properties":{"w":460,"h":420,"sm":{"minWSm":465,"minHSm":410,"maxHSm":1200,"maxWSm":1380},"md":{"minWMd":465,"minHMd":410,"maxHMd":1200,"maxWMd":1380},"lg":{"minWLg":465,"minHLg":410,"maxHLg":1200,"maxWLg":1380},"minItemCols":1,"maxItemCols":1,"minItemRows":1,"maxItemRows":1,"moveEnabled":"true","dragEnabled":"true","resizeEnabled":"true","isStatic":"false","className":"widgets-list widbg3"},"widgetProperty":{"chartTypeHours":"bar","chartTypeEnergy":"line","chartColor":[{"color":"#40c263"}],"icon":"","alertLimit":0,"background":"#d2d2d2","fontColor":"#000","fontFamily":"Arial, Helvetica, sans-serif","fontSize":20,"title":"Usage by Asset Type","markers":[],"zoom":10,"contents":{"entities":{"fontColor":"#000","fontFamily":"Arial, Helvetica, sans-serif","fontSize":16,"title":"Usage by Asset Type","contentTitle":"Entities"},"count":{"fontColor":"#000","fontFamily":"Arial, Helvetica, sans-serif","fontSize":16,"contentTitle":"Entity Count"}}},"minItemRows":20,"maxItemRows":60,"minItemCols":23,"maxItemCols":69},{"id":"554e5d5e-d8b5-43a1-b674-43d5272e9e10","name":"Upcoming Maintenance","type":"alert","componentName":"widget-alert-b","cols":27,"rows":21,"x":42,"y":37,"properties":{"w":540,"h":420,"sm":{"minWSm":390,"minHSm":435,"maxHSm":1000,"maxWSm":1000},"md":{"minWMd":390,"minHMd":435,"maxHMd":1000,"maxWMd":1000},"lg":{"minWLg":390,"minHLg":435,"maxHLg":1000,"maxWLg":1000},"minItemCols":1,"maxItemCols":1,"minItemRows":1,"maxItemRows":1,"moveEnabled":"true","dragEnabled":"true","resizeEnabled":"true","isStatic":"false","className":"widgets-list widbg3"},"widgetProperty":{"chartType":null,"chartColor":[],"icon":"","alertLimit":10,"background":"#d2d2d2","fontColor":"#000","fontFamily":"Arial, Helvetica, sans-serif","fontSize":20,"title":"Upcoming Maintenance","markers":[],"zoom":10,"contents":{"entities":{"fontColor":"#000","fontFamily":"Arial, Helvetica, sans-serif","fontSize":16,"title":"Entities","contentTitle":"Entities"},"count":{"fontColor":"#000","fontFamily":"Arial, Helvetica, sans-serif","fontSize":16,"contentTitle":"Entity Count"}}},"minItemRows":21,"maxItemRows":50,"minItemCols":19,"maxItemCols":50}]', 0, 1, N'00000000-0000-0000-0000-000000000000', 1, 0, CAST(N'2020-07-06T14:52:39.567' AS DateTime), N'00000000-0000-0000-0000-000000000000', CAST(N'2020-07-06T14:53:09.490' AS DateTime), N'00000000-0000-0000-0000-000000000000')

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


