CREATE TABLE [dbo].[AppSetting](
	[AppSettingId] [int] IDENTITY(1,1) NOT NULL,
	[Key] [varchar](50) NOT NULL,
	[Value] [nvarchar](max) NOT NULL,
	[Description] [varchar](500) NULL,
	[Preference] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[AppSettingId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[AppSetting] ADD  DEFAULT ((0)) FOR [Preference]