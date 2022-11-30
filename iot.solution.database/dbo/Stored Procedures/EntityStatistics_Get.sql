/*******************************************************************
DECLARE @output INT = 0
		,@fieldName	nvarchar(255)
		,@syncDate	DATETIME
EXEC [dbo].[EntityStatistics_Get]
	 @guid			= '1D355B70-94CE-44AB-B623-5859DC1BD847'
	,@currentDate	= '2020-07-16 06:47:56.890'
	,@invokingUser  	= '7D31E738-5E24-4EA2-AAEF-47BB0F3CCD41'
	,@version			= 'v1'
	,@output			= @output		OUTPUT
	,@fieldName			= @fieldName	OUTPUT
	,@syncDate		= @syncDate		OUTPUT
               
 SELECT @output status,  @fieldName AS fieldName, @syncDate syncDate    

001	SAR-138 11-05-2020 [Nishit Khakhi]	Added Initial Version to Get Company Statistics
*******************************************************************/

CREATE PROCEDURE [dbo].[EntityStatistics_Get]  
(  @guid    UNIQUEIDENTIFIER   
 ,@currentDate  DATETIME   = NULL  
 ,@invokingUser  UNIQUEIDENTIFIER = NULL  
 ,@version   NVARCHAR(10)  
 ,@output   SMALLINT    OUTPUT  
 ,@fieldName   NVARCHAR(255)   OUTPUT  
 ,@syncDate   DATETIME    OUTPUT  
 ,@culture   NVARCHAR(10)   = 'en-Us'  
 ,@enableDebugInfo CHAR(1)     = '0'  
)  
AS  
BEGIN  
    SET NOCOUNT ON  
 IF (@enableDebugInfo = 1)  
 BEGIN  
        DECLARE @Param XML  
        SELECT @Param =  
        (  
            SELECT 'EntityStatistics_Get' AS '@procName'  
   , CONVERT(nvarchar(MAX),@guid) AS '@guid'     
         , CONVERT(VARCHAR(50),@currentDate) as '@currentDate'  
   , CONVERT(nvarchar(MAX),@invokingUser) AS '@invokingUser'  
   , CONVERT(nvarchar(MAX),@version) AS '@version'  
   , CONVERT(nvarchar(MAX),@output) AS '@output'  
            , CONVERT(nvarchar(MAX),@fieldName) AS '@fieldName'  
            FOR XML PATH('Params')  
     )  
     INSERT INTO DebugInfo(data, dt) VALUES(Convert(nvarchar(MAX), @Param), GETUTCDATE())  
    END  
    Set @output = 1  
    SET @fieldName = 'Success'  
  
    BEGIN TRY  
  SET @syncDate = (SELECT TOP 1 CONVERT(DATETIME,[value]) FROM dbo.[Configuration] (NOLOCK) WHERE [configKey] = 'telemetry-last-exectime')  
  ;WITH CTE_DeviceCount  
  AS ( SELECT EP.[guid]  
      ,  COUNT(distinct D.[guid]) [totalDevices]   
    FROM dbo.[Entity] EP (NOLOCK)  
    LEFT JOIN dbo.[Entity] E (NOLOCK) ON EP.[guid] = E.[parentEntityGuid] AND E.[isDeleted] = 0  
    LEFT JOIN [dbo].[Device] D (NOLOCK) ON E.[guid] = D.[entityGuid] AND D.[isDeleted] = 0  
    LEFT JOIN [dbo].[DeviceAttributeUtilization] DAU (NOLOCK) ON D.[guid] = DAU.[deviceGuid]  
    WHERE EP.[guid] = @guid AND EP.[isDeleted] = 0  
    GROUP BY EP.[guid]  
  )  
  , CTE_DeviceUtilization  
  AS ( SELECT DISTINCT EP.[guid]  
      , DAU.[deviceGuid]  
    FROM dbo.[Entity] EP (NOLOCK)  
    INNER JOIN dbo.[Entity] E (NOLOCK) ON EP.[guid] = E.[parentEntityGuid] AND E.[isDeleted] = 0  
    INNER JOIN [dbo].[Device] D (NOLOCK) ON E.[guid] = D.[entityGuid] AND D.[isDeleted] = 0  
    INNER JOIN [dbo].[DeviceAttributeUtilization] DAU (NOLOCK) ON D.[guid] = DAU.[deviceGuid]  
    WHERE EP.[guid] = @guid AND EP.[isDeleted] = 0  
   )  
  , CTE_Maintenance  
  AS ( SELECT EP.[guid] AS [guid]   
     , DM.[guid] AS [deviceMaintenanceguid]  
     ,CASE WHEN @currentDate >= [startDateTime] AND @currentDate <= [endDateTime]  
      THEN 'Under Maintenance'  
      ELSE CASE WHEN [startDateTime] < @currentDate AND [endDateTime] < @currentDate   
      THEN 'Completed'  
      ELSE 'Scheduled'  
      END  
      END AS [status]  
    FROM dbo.[Entity] EP (NOLOCK)  
    INNER JOIN dbo.[Entity] E (NOLOCK) ON EP.[guid] = E.[parentEntityGuid] AND E.[isDeleted] = 0  
    INNER JOIN [dbo].[Device] D (NOLOCK) ON E.[guid] = D.[entityGuid] AND D.[isDeleted] = 0  
    INNER JOIN dbo.[DeviceMaintenance] DM (NOLOCK) ON D.[guid] = DM.[deviceGuid] AND DM.[isDeleted] = 0  
    WHERE EP.[guid] = @guid AND MONTH(DM.[createdDate]) = MONTH(@currentDate) AND YEAR(DM.[createdDate]) = YEAR(@currentDate)   
    AND EP.[IsDeleted]=0   
   )  
  , CTE_Zones   
  AS ( SELECT EP.[guid], COUNT(E.[guid]) AS [totalSubEntities]  
    FROM dbo.[Entity] EP (NOLOCK)  
    INNER JOIN dbo.[Entity] E (NOLOCK) ON EP.[guid] = E.[parentEntityGuid] AND E.[isDeleted] = 0  
    WHERE EP.[guid] = @guid AND EP.[IsDeleted]=0   
    GROUP BY EP.[guid]  
  )  
  ,CTE_AlertCount  
  AS ( SELECT EP.[guid]  
      , COUNT(I.[guid]) AS [totalAlerts]  
    FROM [dbo].[IOTConnectAlert] I (NOLOCK)   
    INNER JOIN dbo.[Entity] E (NOLOCK) ON I.[entityGuid] = E.[guid] AND E.[isDeleted] = 0  
    INNER JOIN dbo.[Entity] EP (NOLOCK) ON E.[parentEntityGuid] = EP.[guid] AND EP.[isDeleted] = 0  
    WHERE EP.[guid] = @guid AND MONTH([eventDate]) = MONTH(@currentDate) AND YEAR([eventDate]) = YEAR(@currentDate)  
    GROUP BY EP.[guid]  
  )  
  SELECT C.[guid]  
    , ISNULL(U.[totalUtilized],0) AS [totalUtilized]  
    , ISNULL(D.[totalDevices],0) AS [totalDevices]  
    , ISNULL(D.[totalDevices],0) - (ISNULL(U.[totalUtilized],0) - ISNULL(CM.[underMaintenanceCount],0)) AS [totalAvailable]  
    , ISNULL(CM.[underMaintenanceCount],0) + ISNULL(CM.[scheduleMaintenanceCount],0) AS [totalMaintenanceCount]  
    , ISNULL(CM.[underMaintenanceCount],0) AS [totalUnderMaintenanceCount]  
    , ISNULL(CM.[scheduleMaintenanceCount],0) AS [totalScheduledCount]  
    , ISNULL(CZ.[totalSubEntities],0) AS [totalSubEntities]  
    , ISNULL(A.[totalAlerts],0) AS [totalAlerts]  
  FROM [dbo].[Entity] C (NOLOCK)   
  LEFT JOIN CTE_DeviceCount D ON C.[guid] = D.[guid]  
  LEFT JOIN CTE_Zones CZ ON C.[guid] = CZ.[guid]  
  LEFT JOIN CTE_AlertCount A ON C.[guid] = A.[guid]  
  LEFT JOIN (SELECT M.[guid]  
      , SUM(CASE WHEN [status] = 'Under Maintenance' THEN 1 ELSE 0 END) AS [underMaintenanceCount]  
      , SUM(CASE WHEN [status] = 'Scheduled' THEN 1 ELSE 0 END) AS [scheduleMaintenanceCount]  
     FROM CTE_Maintenance M   
     GROUP BY M.[guid]) CM ON C.[guid] = CM.[guid]  
  LEFT JOIN ( SELECT [guid]   
       , COUNT([deviceGuid]) AS [totalUtilized]  
     FROM CTE_DeviceUtilization CDU   
     GROUP BY [guid]  
    ) U ON C.[guid] = U.[guid]  
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