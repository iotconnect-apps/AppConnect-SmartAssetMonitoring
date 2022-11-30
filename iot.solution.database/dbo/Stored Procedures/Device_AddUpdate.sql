﻿/*******************************************************************
DECLARE @output INT = 0
	,@fieldName	nvarchar(255)
	,@newid UNIQUEIDENTIFIER

EXEC [dbo].[Device_AddUpdate]
	@guid					= '3141C24F-81E5-48D2-BD55-2488117C0FDC'
	,@companyGuid			= 'DC4B1A8B-38D8-4431-83D0-933DE2DD4324'
	,@entityGuid			= 'ED7B5441-D162-48C1-869C-4068E33FD785'
	,@templateGuid			= '12A5CD86-F6C6-455F-B27A-EFE587ED410D'
	,@parentDeviceGuid		= '12A5CD86-F6C6-455F-B27A-EFE587ED410D'
	,@typeGuid				= '12A5CD86-F6C6-455F-B27A-EFE587ED410D'
	,@uniqueId				= 'Device656 uniqueId 1'
	,@name					= 'Device 656 name 1'
	,@isProvisioned			= 0
	,@attrData				= '<attrbs><attrb><attrGuid>12A5CD86-F6C6-455F-B27A-EFE587ED410D</attrGuid><attrName>devTemp</attrName><dispName>Temprature1</dispName></attrb>
										<attrb><attrGuid>12A5CD86-F6C6-455F-B26A-EFE587ED410D</attrGuid><attrName>devCurrent</attrName><dispName>Current1</dispName></attrb>
										<attrb><attrGuid>12A5CD86-F6C6-455F-B25A-EFE587ED410D</attrGuid><attrName>devVibration</attrName><dispName>Vibration1</dispName></attrb>
								</attrbs>'
	,@sensorGuid			= '200EDCFA-8FF1-4837-91B1-7D5F967F5129'
	,@sensorCondition		= 'sfsd'
	,@sensorValue			= '30'
	,@invokingUser			= '200EDCFA-8FF1-4837-91B1-7D5F967F5129'
	,@version				= 'v1'
	,@output				= @output		OUTPUT
	,@fieldName				= @fieldName	OUTPUT
	,@newid					= @newid		OUTPUT

SELECT @output status, @fieldName fieldname,@newid newid

001	SAR-138 03-07-2020 [Nishit Khakhi]	Added Initial Version to Add Update Device, Device Attribute
*******************************************************************/

CREATE PROCEDURE [dbo].[Device_AddUpdate]
(	@guid				UNIQUEIDENTIFIER
	,@companyGuid		UNIQUEIDENTIFIER
	,@entityGuid		UNIQUEIDENTIFIER
	,@parentDeviceGuid	UNIQUEIDENTIFIER	= NULL
	,@templateGuid		UNIQUEIDENTIFIER
	,@typeGuid			UNIQUEIDENTIFIER	
	,@uniqueId			NVARCHAR(500)
	,@name	 			NVARCHAR(500)
	,@description		NVARCHAR(1000)		= NULL
	,@specification		NVARCHAR(1000)		= NULL
	--,@note				NVARCHAR(1000)		= NULL
	--,@tag				NVARCHAR(50)		= NULL
	--,@image				NVARCHAR(200)		= NULL
	,@isProvisioned		BIT					= 0
	,@attrData			XML					= NULL
	,@sensorGuid		UNIQUEIDENTIFIER
	,@sensorCondition	NVARCHAR(1000)
	,@sensorValue		NVARCHAR(100)
	,@invokingUser		UNIQUEIDENTIFIER
	,@version			NVARCHAR(10)
	,@output			SMALLINT			OUTPUT
	,@fieldName			NVARCHAR(100)		OUTPUT
	,@newid				UNIQUEIDENTIFIER   	OUTPUT
	,@culture			NVARCHAR(10)		= 'en-Us'
	,@enableDebugInfo	 CHAR(1)			= '0'
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
            SELECT 'Device_AddUpdate' AS '@procName'
			, CONVERT(nvarchar(MAX),@guid) AS '@guid'
			, CONVERT(nvarchar(MAX),@companyGuid) AS '@companyGuid'
			, CONVERT(nvarchar(MAX),@entityGuid) AS '@entityGuid'
			, CONVERT(nvarchar(MAX),@templateGuid) AS '@templateGuid'
			, CONVERT(nvarchar(MAX),@typeGuid) AS '@typeGuid'
			, @uniqueId AS '@uniqueId'
            , @name AS '@name'
			, @description AS '@description'
			, @specification AS '@specification'
			--, @note AS '@note'
			--, @tag AS '@tag'
			--, @image AS '@image'
			, CONVERT(nvarchar(MAX),@isProvisioned) AS '@isProvisioned'
			, CONVERT(nvarchar(MAX),@attrData) AS '@attrData'
			, CONVERT(nvarchar(MAX),@sensorGuid) AS '@sensorGuid'
			, CONVERT(nvarchar(MAX),@sensorCondition) AS '@sensorCondition'
			, CONVERT(nvarchar(MAX),@sensorValue) AS '@sensorValue'
            , CONVERT(nvarchar(MAX),@invokingUser) AS '@invokingUser'
            , CONVERT(nvarchar(MAX),@version) AS '@version'
            , CONVERT(nvarchar(MAX),@output) AS '@output'
            , CONVERT(nvarchar(MAX),@fieldName) AS '@fieldName'
			, CONVERT(nvarchar(MAX),@guid) AS '@newid'
            FOR XML PATH('Params')
	    )
	    INSERT INTO DebugInfo(data, dt) VALUES(Convert(nvarchar(MAX), @Param), @dt)
    END

	SET @output = 1
	SET @fieldName = 'Success'
	
	BEGIN TRY
		IF NOT EXISTS(SELECT TOP 1 1 FROM [dbo].[Device] (NOLOCK) where [guid] = @guid AND companyGuid = @companyGuid AND isdeleted = 0)
		BEGIN	
			IF EXISTS(SELECT TOP 1 1 FROM [dbo].[Device] (NOLOCK) where [uniqueId] = @uniqueId AND isdeleted = 0)
			BEGIN	
				SET @output = -1
				SET @fieldName = 'UniqueIdAlreadyExists'
				Return;
			END
		END

		IF OBJECT_ID ('tempdb..#Attribute_Data') IS NOT NULL DROP TABLE #Attribute_Data

		CREATE TABLE #Attribute_Data
		(	[attrGuid]		UNIQUEIDENTIFIER
			,[attrName]			NVARCHAR(100)
			,[attrDispName]		NVARCHAR(100)
		)
		INSERT INTO #Attribute_Data
		SELECT DISTINCT 
				 x.R.query('./attrGuid').value('.', 'NVARCHAR(50)') AS [attrGuid]
				, x.R.query('./attrName').value('.', 'NVARCHAR(100)') AS [attrName]
				, x.R.query('./dispName').value('.', 'NVARCHAR(100)') AS [dispName]
			FROM @attrData.nodes('/attrbs/attrb') as x(R)

		SET @newid = @guid
		BEGIN TRAN
			IF NOT EXISTS(SELECT TOP 1 1 FROM [dbo].[Device] (NOLOCK) where [guid] = @guid AND companyGuid = @companyGuid AND isdeleted = 0)
			BEGIN	
				INSERT INTO [dbo].[Device]
			           ([guid]
			           ,[companyGuid]
			           ,[entityGuid]
			           ,[templateGuid]
					   ,[parentDeviceGuid]
			           ,[typeGuid]
			           ,[uniqueId]
			           ,[name]
					   ,[description]
					   ,[specification]
					   --,[note]
					   --,[tag]
					   --,[image]
					   ,[isProvisioned]
					   ,[sensorGuid]
					   ,[sensorCondition]
					   ,[sensorValue]
			           ,[isActive]
					   ,[isDeleted]
			           ,[createdDate]
			           ,[createdBy]
			           ,[updatedDate]
			           ,[updatedBy]
						)
			     VALUES
			           (@guid
			           ,@companyGuid
			           ,@entityGuid
			           ,@templateGuid
					   ,@parentDeviceGuid
			           ,@typeGuid
			           ,@uniqueId
			           ,@name
					   ,@description
					   ,@specification
					   --,@note
						--,@tag
						--,@image
					   ,@isProvisioned
					   ,@sensorGuid
					   ,@sensorCondition
					   ,@sensorValue
					   ,1
			           ,0
			           ,@dt
			           ,@invokingUser				   
					   ,@dt
					   ,@invokingUser				   
				       );

					INSERT INTO dbo.[deviceAttribute]([guid], [companyGuid], [deviceGuid], [attrGuid], [attrName], [displayName], [createdDate], [createdBy], [updatedDate], [updatedBy])
					SELECT NEWID(), @companyGuid, @guid, A.[attrGuid], A.[attrName], A.[attrDispName], @dt, @invokingUser, @dt, @invokingUser
					FROM #Attribute_Data A
			END
			ELSE
			BEGIN
				UPDATE [dbo].[Device]
				SET --[entityGuid] = @entityGuid
					--,[parentDeviceGuid] = @parentDeviceGuid
					--,[templateGuid] = @templateGuid
					--,[typeGuid] = @typeGuid
					[name] = @name
					,[description] = @description
					,[specification] = @specification
					--,[tag] = ISNULL(@tag,[tag])
					--,[note] = ISNULL(@note,[note])
					--,[isProvisioned] = @isProvisioned
					--,[sensorGuid] = @sensorGuid
					--,[sensorCondition] = @sensorCondition
					--,[sensorValue] = @sensorValue
					,[updatedDate] = @dt
					,[updatedBy] = @invokingUser
				WHERE [guid] = @guid AND [companyGuid] = @companyGuid AND [isDeleted] = 0

				MERGE dbo.[deviceAttribute] DA USING #Attribute_Data A
				ON DA.[deviceGuid] = @guid AND [companyGuid] = @companyGuid AND [isDeleted] = 0 AND DA.[attrGuid] = A.[attrGuid]
				WHEN MATCHED THEN
					UPDATE SET [attrName] = A.[attrName],
								[displayName] = A.[attrDispName]
				WHEN NOT MATCHED THEN
					INSERT ([guid], [companyGuid], [deviceGuid], [attrGuid], [attrName], [displayName], [createdDate], [createdBy], [updatedDate], [updatedBy])
					VALUES (NEWID(), @companyGuid, @guid, A.[attrGuid], A.[attrName], A.[attrDispName], @dt, @invokingUser, @dt, @invokingUser);
				--WHEN NOT MATCHED BY SOURCE
				--	THEN DELETE;

			END
		
		
		COMMIT TRAN

	END TRY

	BEGIN CATCH

	SET @output = 0
	DECLARE @errorReturnMessage nvarchar(MAX)

	SELECT
		@errorReturnMessage = ISNULL(@errorReturnMessage, ' ') + SPACE(1) +
		'ErrorNumber:' + ISNULL(CAST(ERROR_NUMBER() AS nvarchar), ' ') +
		'ErrorSeverity:' + ISNULL(CAST(ERROR_SEVERITY() AS nvarchar), ' ') +
		'ErrorState:' + ISNULL(CAST(ERROR_STATE() AS nvarchar), ' ') +
		'ErrorLine:' + ISNULL(CAST(ERROR_LINE() AS nvarchar), ' ') +
		'ErrorProcedure:' + ISNULL(CAST(ERROR_PROCEDURE() AS nvarchar), ' ') +
		'ErrorMessage:' + ISNULL(CAST(ERROR_MESSAGE() AS nvarchar(MAX)), ' ')

	RAISERROR (@errorReturnMessage
	, 11
	, 1
	)

	IF (XACT_STATE()) = -1 BEGIN
		ROLLBACK TRANSACTION
	END
	IF (XACT_STATE()) = 1 BEGIN
		ROLLBACK TRANSACTION
	END
	END CATCH
END