/*******************************************************************
DECLARE @output INT = 0
		,@fieldName	nvarchar(255)
		,@syncDate	DATETIME
EXEC [dbo].[CompanyStatistics_Get]
	 @guid				= 'DC4B1A8B-38D8-4431-83D0-933DE2DD4324'
	,@currentDate	= '2020-07-02 06:47:56.890'
	,@invokingUser  	= '7D31E738-5E24-4EA2-AAEF-47BB0F3CCD41'
	,@version			= 'v1'
	,@output			= @output		OUTPUT
	,@fieldName			= @fieldName	OUTPUT
	,@syncDate		= @syncDate		OUTPUT
               
 SELECT @output status,  @fieldName AS fieldName, @syncDate syncDate    
 
001	SAR-138 11-05-2020 [Nishit Khakhi]	Added Initial Version to Get Company Statistics
*******************************************************************/

CREATE PROCEDURE [dbo].[CompanyStatistics_Get]
(	 @guid				UNIQUEIDENTIFIER	
	,@currentDate		DATETIME			= NULL
	,@invokingUser		UNIQUEIDENTIFIER	= NULL
	,@version			NVARCHAR(10)
	,@output			SMALLINT		  OUTPUT
	,@fieldName			NVARCHAR(255)	  OUTPUT
	,@syncDate			DATETIME		  OUTPUT
	,@culture			NVARCHAR(10)	  = 'en-Us'
	,@enableDebugInfo	CHAR(1)			  = '0'
)
AS
BEGIN
    SET NOCOUNT ON
	DECLARE @dt DATETIME = GETUTCDATE() 
	IF (@enableDebugInfo = 1)
	BEGIN
        DECLARE @Param XML
        SELECT @Param =
        (
            SELECT 'CompanyStatistics_Get' AS '@procName'
			, CONVERT(nvarchar(MAX),@guid) AS '@guid'			
	        , CONVERT(VARCHAR(50),@currentDate) as '@currentDate'
			, CONVERT(nvarchar(MAX),@invokingUser) AS '@invokingUser'
			, CONVERT(nvarchar(MAX),@version) AS '@version'
			, CONVERT(nvarchar(MAX),@output) AS '@output'
            , CONVERT(nvarchar(MAX),@fieldName) AS '@fieldName'
            FOR XML PATH('Params')
	    )
	    INSERT INTO DebugInfo(data, dt) VALUES(Convert(nvarchar(MAX), @Param), @dt)
    END
    Set @output = 1
    SET @fieldName = 'Success'

    BEGIN TRY
		SET @syncDate = (SELECT TOP 1 CONVERT(DATETIME,[value]) FROM dbo.[Configuration] (NOLOCK) WHERE [configKey] = 'telemetry-last-exectime')
		;WITH CTE_Location
		AS (	SELECT [companyGuid], COUNT(1) [totalCount] 
				FROM [dbo].[Entity] (NOLOCK) 
				WHERE [companyGuid] = @guid AND [isDeleted] = 0 AND [parentEntityGuid] IS NULL 
				 and [Guid] not in (select entityGuid from [dbo].[Company] where [Guid]=@guid) 
				GROUP BY [companyGuid]
		)
		,CTE_Zones
		AS (	SELECT [companyGuid], COUNT(1) [totalCount] 
				FROM [dbo].[Entity] (NOLOCK) 
				WHERE [companyGuid] = @guid AND [isDeleted] = 0 AND [parentEntityGuid] IS NOT NULL 
				 and [Guid] not in (select entityGuid from [dbo].[Company] where [Guid]=@guid) 
				GROUP BY [companyGuid]
		)
		,CTE_DeviceType
		AS (	SELECT [companyGuid]
						, COUNT([guid]) [totalDeviceType] 
				FROM [dbo].[DeviceType] (NOLOCK) 
				WHERE [companyGuid] = @guid AND [isDeleted] = 0
				GROUP BY [companyGuid]
		)
		,CTE_DeviceCount
		AS (	SELECT [companyGuid]
						, COUNT([guid]) [totalDevices] 
				FROM [dbo].[Device] (NOLOCK) 
				WHERE [companyGuid] = @guid AND [isDeleted] = 0
				GROUP BY [companyGuid]
		)
		, CTE_Maintenance
		AS (	SELECT DM.[companyGuid] AS [companyGuid]
					, DM.[guid] AS [guid]
					,CASE WHEN @currentDate >= [startDateTime] AND @currentDate <= [endDateTime]
					 THEN 'Under Maintenance'
					 ELSE CASE WHEN [startDateTime] < @currentDate AND [endDateTime] < @currentDate 
					 THEN 'Completed'
					 ELSE 'Scheduled'
					 END
					 END AS [status]
				FROM dbo.[DeviceMaintenance] DM (NOLOCK) 
				INNER JOIN [dbo].[Device] E ON DM.[DeviceGuid] = E.[guid] AND E.[isDeleted] = 0
				WHERE DM.[companyGuid] = @guid AND MONTH(DM.[createdDate]) = MONTH(@dt) AND YEAR(DM.[createdDate]) = YEAR(@dt) 
				AND DM.[IsDeleted]=0 
			)
			,CTE_UserCount
		AS (	SELECT [companyGuid]
		                , COUNT(1) [totalUserCount]
						, SUM(CASE WHEN [isActive] = 1 THEN 1 ELSE 0 END) [activeUserCount] 
						, SUM(CASE WHEN [isActive] = 0 THEN 1 ELSE 0 END) [inactiveUserCount] 
				FROM [dbo].[User] (NOLOCK) 
				WHERE [companyGuid] = @guid AND [isDeleted] = 0
				GROUP BY [companyGuid]
		)
		,CTE_AlertCount
		AS (	SELECT [companyGuid]
						, COUNT([guid]) AS [totalAlerts]
				FROM [dbo].[IOTConnectAlert] (NOLOCK) 
				WHERE [companyGuid] = @guid AND MONTH([eventDate]) = MONTH(@dt) AND YEAR([eventDate]) = YEAR(@dt)
				GROUP BY [companyGuid]
		)
		SELECT [guid]
				, ISNULL(L.[totalCount],0) AS [totalEntities]
				, ISNULL(Z.[totalCount],0) AS [totalSubEntities]
				, ISNULL(D.[totalDevices],0) AS [totalDevices]
				, ISNULL(DT.[totalDeviceType],0) AS [totalDeviceType]
				, ISNULL( U.[activeUserCount],0) AS [activeUserCount]
				, ISNULL( U.[inactiveUserCount],0) AS [inactiveUserCount]
				, ISNULL( U.[totalUserCount],0) AS [totalUserCount]
				, ISNULL(CM.[underMaintenanceCount],0) + ISNULL(CM.[scheduleMaintenanceCount],0) AS [totalMaintenanceCount]
				, ISNULL(CM.[underMaintenanceCount],0) AS [totalUnderMaintenanceCount]
				, ISNULL(CM.[scheduleMaintenanceCount],0) AS [totalScheduledCount]
				, ISNULL(A.[totalAlerts],0) AS [totalAlerts]
		FROM [dbo].[Company] C (NOLOCK) 
		LEFT JOIN CTE_Location L ON C.[guid] = L.[companyGuid]
		LEFT JOIN CTE_Zones Z ON C.[guid] = Z.[companyGuid]
		LEFT JOIN CTE_DeviceCount D ON C.[guid] = D.[companyGuid]
		LEFT JOIN CTE_UserCount U ON C.[guid] = U.[companyGuid]
		LEFT JOIN CTE_DeviceType DT ON C.[guid] = DT.[companyGuid]
		LEFT JOIN (SELECT M.[companyGuid]
						, SUM(CASE WHEN [status] = 'Under Maintenance' THEN 1 ELSE 0 END) AS [underMaintenanceCount]
						, SUM(CASE WHEN [status] = 'Scheduled' THEN 1 ELSE 0 END) AS [scheduleMaintenanceCount]
					FROM CTE_Maintenance M 
					GROUP BY M.[companyGuid]) CM ON C.[guid] = CM.[companyGuid]
		LEFT JOIN CTE_AlertCount A ON C.[guid] = A.[companyGuid]
		WHERE C.[guid]=@guid AND C.[isDeleted]=0
		
	END TRY
	BEGIN CATCH
		DECLARE @errorReturnMessage nvarchar(MAX)

		SET @output = 0

		SELECT @errorReturnMessage =
			ISNULL(@errorReturnMessage, '') +  SPACE(1)   +
			'ErrorNumber:'  + ISNULL(CAST(ERROR_NUMBER() as nvarchar), '')  +
			'ErrorSeverity:'  + ISNULL(CAST(ERROR_SEVERITY() as nvarchar), '') +
			'ErrorState:'  + ISNULL(CAST(ERROR_STATE() as nvarchar), '') +
			'ErrorLine:'  + ISNULL(CAST(ERROR_LINE () as nvarchar), '') +
			'ErrorProcedure:'  + ISNULL(CAST(ERROR_PROCEDURE() as nvarchar), '') +
			'ErrorMessage:'  + ISNULL(CAST(ERROR_MESSAGE() as nvarchar(max)), '')
		RAISERROR (@errorReturnMessage, 11, 1)

		IF (XACT_STATE()) = -1
		BEGIN
			ROLLBACK TRANSACTION
		END
		IF (XACT_STATE()) = 1
		BEGIN
			ROLLBACK TRANSACTION
		END
		RAISERROR (@errorReturnMessage, 11, 1)
	END CATCH
END