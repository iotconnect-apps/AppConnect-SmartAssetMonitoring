CREATE TABLE [dbo].[DocumentTag](
	[DocumentTagId] [uniqueidentifier] NOT NULL,
	[DocumentTag] [varchar](100) NOT NULL,
	[IsDeleted] [bit] NULL,
 CONSTRAINT [PK__Document__960CE415519E60CB] PRIMARY KEY CLUSTERED 
(
	[DocumentTagId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[DocumentTag] ADD  CONSTRAINT [DF__DocumentT__Docum__239E4DCF]  DEFAULT (newid()) FOR [DocumentTagId]
GO
ALTER TABLE [dbo].[DocumentTag] ADD  CONSTRAINT [DF__DocumentT__IsDel__24927208]  DEFAULT ((0)) FOR [IsDeleted]