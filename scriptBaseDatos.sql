USE [master]
GO
/****** Object:  Database [gestionFacturas]    Script Date: 19/03/2025 21:57:45 ******/
CREATE DATABASE [gestionFacturas]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'gestionFacturas', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\gestionFacturas.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'gestionFacturas_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\gestionFacturas_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [gestionFacturas] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [gestionFacturas].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [gestionFacturas] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [gestionFacturas] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [gestionFacturas] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [gestionFacturas] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [gestionFacturas] SET ARITHABORT OFF 
GO
ALTER DATABASE [gestionFacturas] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [gestionFacturas] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [gestionFacturas] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [gestionFacturas] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [gestionFacturas] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [gestionFacturas] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [gestionFacturas] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [gestionFacturas] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [gestionFacturas] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [gestionFacturas] SET  DISABLE_BROKER 
GO
ALTER DATABASE [gestionFacturas] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [gestionFacturas] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [gestionFacturas] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [gestionFacturas] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [gestionFacturas] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [gestionFacturas] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [gestionFacturas] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [gestionFacturas] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [gestionFacturas] SET  MULTI_USER 
GO
ALTER DATABASE [gestionFacturas] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [gestionFacturas] SET DB_CHAINING OFF 
GO
ALTER DATABASE [gestionFacturas] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [gestionFacturas] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [gestionFacturas] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [gestionFacturas] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [gestionFacturas] SET QUERY_STORE = ON
GO
ALTER DATABASE [gestionFacturas] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [gestionFacturas]
GO
/****** Object:  Table [dbo].[cliente]    Script Date: 19/03/2025 21:57:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[cliente](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [nvarchar](500) NOT NULL,
	[tipoIdentificacion] [int] NOT NULL,
	[identificacion] [nvarchar](15) NOT NULL,
	[telefono] [nvarchar](15) NULL,
	[correo] [nvarchar](100) NULL,
	[direccion] [nvarchar](max) NULL,
	[fechaCreacion] [datetime] NULL,
	[fechaActualizacion] [datetime] NULL,
	[usuarioCreacion] [int] NOT NULL,
	[usuarioActualizacion] [int] NULL,
	[activo] [bit] NULL,
 CONSTRAINT [PK_cliente] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[detalleFactura]    Script Date: 19/03/2025 21:57:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[detalleFactura](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[facturaId] [int] NOT NULL,
	[productoId] [int] NOT NULL,
	[nombreProducto] [nvarchar](100) NOT NULL,
	[cantidad] [int] NOT NULL,
	[precioUnitario] [decimal](18, 4) NOT NULL,
	[precioTotal] [decimal](18, 4) NOT NULL,
 CONSTRAINT [PK_detalleFactura] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[factura]    Script Date: 19/03/2025 21:57:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[factura](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[clienteId] [int] NOT NULL,
	[nombreCliente] [nvarchar](500) NOT NULL,
	[tipoIdentificacionCliente] [int] NOT NULL,
	[identificacionCliente] [nvarchar](15) NOT NULL,
	[telefonoCliente] [nvarchar](15) NULL,
	[correoCliente] [nvarchar](100) NULL,
	[fechaEmision] [datetime] NULL,
	[tipoPagoId] [int] NOT NULL,
	[pagada] [bit] NOT NULL,
	[subtotal] [decimal](18, 4) NOT NULL,
	[porcentajeIva] [int] NOT NULL,
	[iva] [decimal](18, 4) NOT NULL,
	[total] [decimal](18, 2) NOT NULL,
	[usuarioId] [int] NOT NULL,
	[fechaCreacion] [datetime] NULL,
	[fechaActualizacion] [datetime] NULL,
	[usuarioActualizacion] [int] NULL,
 CONSTRAINT [PK_factura] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[producto]    Script Date: 19/03/2025 21:57:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[producto](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[codigo] [nvarchar](5) NOT NULL,
	[nombre] [nvarchar](100) NOT NULL,
	[descripcion] [nvarchar](max) NULL,
	[precio] [decimal](18, 4) NOT NULL,
	[fechaCreacion] [datetime] NULL,
	[fechaActualizacion] [datetime] NULL,
	[usuarioCreacion] [int] NOT NULL,
	[usuarioActualizacion] [int] NULL,
	[activo] [bit] NULL,
 CONSTRAINT [PK_producto] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tipoIdentificacion]    Script Date: 19/03/2025 21:57:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tipoIdentificacion](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [nvarchar](100) NOT NULL,
	[descripcion] [nvarchar](max) NULL,
 CONSTRAINT [PK_tipoIdentificacion] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tipoPago]    Script Date: 19/03/2025 21:57:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tipoPago](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [nvarchar](100) NOT NULL,
	[descripcion] [nvarchar](max) NULL,
 CONSTRAINT [PK_tipoPago] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[usuario]    Script Date: 19/03/2025 21:57:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[usuario](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nombres] [nvarchar](100) NOT NULL,
	[apellidos] [nvarchar](100) NOT NULL,
	[usuario] [nvarchar](10) NOT NULL,
	[correo] [nvarchar](100) NULL,
	[contrasena] [nvarchar](max) NOT NULL,
	[fechaCreacion] [datetime] NULL,
	[fechaActualizacion] [datetime] NULL,
	[activo] [bit] NOT NULL,
	[token] [nvarchar](max) NULL,
	[refreshToken] [nvarchar](max) NULL,
	[expiracionToken] [datetime] NULL,
 CONSTRAINT [PK_usuario] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[cliente] ON 

INSERT [dbo].[cliente] ([id], [nombre], [tipoIdentificacion], [identificacion], [telefono], [correo], [direccion], [fechaCreacion], [fechaActualizacion], [usuarioCreacion], [usuarioActualizacion], [activo]) VALUES (1, N'test', 1, N'1234567890', N'0999999999', N'', N'a', CAST(N'2025-03-20T02:08:53.637' AS DateTime), CAST(N'2025-03-20T02:10:49.377' AS DateTime), 1, 1, 1)
INSERT [dbo].[cliente] ([id], [nombre], [tipoIdentificacion], [identificacion], [telefono], [correo], [direccion], [fechaCreacion], [fechaActualizacion], [usuarioCreacion], [usuarioActualizacion], [activo]) VALUES (2, N'asd', 1, N'1234567890001', N'', N'', N'', CAST(N'2025-03-20T02:40:31.767' AS DateTime), NULL, 1, NULL, 1)
INSERT [dbo].[cliente] ([id], [nombre], [tipoIdentificacion], [identificacion], [telefono], [correo], [direccion], [fechaCreacion], [fechaActualizacion], [usuarioCreacion], [usuarioActualizacion], [activo]) VALUES (3, N'test2', 1, N'2234567890001', N'', N'', N'', CAST(N'2025-03-20T02:48:43.907' AS DateTime), CAST(N'2025-03-19T21:49:54.313' AS DateTime), 1, NULL, 0)
SET IDENTITY_INSERT [dbo].[cliente] OFF
GO
SET IDENTITY_INSERT [dbo].[producto] ON 

INSERT [dbo].[producto] ([id], [codigo], [nombre], [descripcion], [precio], [fechaCreacion], [fechaActualizacion], [usuarioCreacion], [usuarioActualizacion], [activo]) VALUES (1, N'10101', N'test', N'', CAST(10.0000 AS Decimal(18, 4)), CAST(N'2025-03-20T00:16:25.050' AS DateTime), NULL, 1, NULL, 1)
INSERT [dbo].[producto] ([id], [codigo], [nombre], [descripcion], [precio], [fechaCreacion], [fechaActualizacion], [usuarioCreacion], [usuarioActualizacion], [activo]) VALUES (2, N'10102', N'test2', NULL, CAST(4.5600 AS Decimal(18, 4)), CAST(N'2025-03-20T00:32:05.020' AS DateTime), CAST(N'2025-03-20T00:32:22.337' AS DateTime), 1, 1, 1)
INSERT [dbo].[producto] ([id], [codigo], [nombre], [descripcion], [precio], [fechaCreacion], [fechaActualizacion], [usuarioCreacion], [usuarioActualizacion], [activo]) VALUES (3, N'10103', N'asd', N'descripcion', CAST(1.0000 AS Decimal(18, 4)), CAST(N'2025-03-20T00:33:33.050' AS DateTime), CAST(N'2025-03-19T19:33:53.783' AS DateTime), 1, 1, 0)
SET IDENTITY_INSERT [dbo].[producto] OFF
GO
SET IDENTITY_INSERT [dbo].[tipoIdentificacion] ON 

INSERT [dbo].[tipoIdentificacion] ([id], [nombre], [descripcion]) VALUES (1, N'RUC', NULL)
INSERT [dbo].[tipoIdentificacion] ([id], [nombre], [descripcion]) VALUES (2, N'CÉDULA', NULL)
SET IDENTITY_INSERT [dbo].[tipoIdentificacion] OFF
GO
SET IDENTITY_INSERT [dbo].[usuario] ON 

INSERT [dbo].[usuario] ([id], [nombres], [apellidos], [usuario], [correo], [contrasena], [fechaCreacion], [fechaActualizacion], [activo], [token], [refreshToken], [expiracionToken]) VALUES (1, N'DANIELA', N'MOREIRA', N'admin', N'a@gmail.com', N'8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', CAST(N'2025-03-17T12:19:11.340' AS DateTime), NULL, 1, N'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJuYmYiOjE3NDI0MzY0NzMsImV4cCI6MTc0MjQ0MDA3M30.RCL8ub7y1OViS8KWiwsiB-P1XsNqTzZFjMnQKI_WFdE', N'62v91ft3nZfiQowMSGkEp4GiSzIxuNPtKTuGmW6f3GMBiEZau1QgGMV5p05L0MnNosU6UXqtti66PVVeQ2PRaQ==', CAST(N'2025-03-20T03:07:53.000' AS DateTime))
INSERT [dbo].[usuario] ([id], [nombres], [apellidos], [usuario], [correo], [contrasena], [fechaCreacion], [fechaActualizacion], [activo], [token], [refreshToken], [expiracionToken]) VALUES (2, N'asd', N'asd', N'asd', N'asd@gmail.com', N'5fd924625f6ab16a19cc9807c7c506ae1813490e4ba675f843d5a10e0baacdb8', NULL, NULL, 0, NULL, NULL, NULL)
INSERT [dbo].[usuario] ([id], [nombres], [apellidos], [usuario], [correo], [contrasena], [fechaCreacion], [fechaActualizacion], [activo], [token], [refreshToken], [expiracionToken]) VALUES (4, N'TEST', N'TEST', N'TEST', N'test@gmail.com', N'e521572efd21136e8a6ec3510ae1b7242f6155661907b5979f887dc0bf401524', NULL, CAST(N'2025-03-19T20:29:12.200' AS DateTime), 1, N'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQiLCJuYmYiOjE3NDI0MTYyMTAsImV4cCI6MTc0MjQxOTgxMH0.ZFZ9XW9D06pQlJ1KEUzSUCNYMyv4fYVp7l8-FzTvJZU', N'IBUBe++HD+YMVKWVQBzyfdZ2N9DOTaeX2RGAaVLGXJHBs4Oln9CU51NjUj5RC6Y/T8TKiHRWoA197NbjCAgftQ==', CAST(N'2025-03-19T21:30:10.000' AS DateTime))
INSERT [dbo].[usuario] ([id], [nombres], [apellidos], [usuario], [correo], [contrasena], [fechaCreacion], [fechaActualizacion], [activo], [token], [refreshToken], [expiracionToken]) VALUES (6, N'ADMIN', N'2', N'admin2', N'admin2@gmail.com', N'240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', CAST(N'2025-03-20T00:49:46.647' AS DateTime), NULL, 1, NULL, NULL, NULL)
INSERT [dbo].[usuario] ([id], [nombres], [apellidos], [usuario], [correo], [contrasena], [fechaCreacion], [fechaActualizacion], [activo], [token], [refreshToken], [expiracionToken]) VALUES (7, N'abc', N'zxc', N'abc', N'az@gmail.com', N'bbb59da3af939f7af5f360f2ceb80a496e3bae1cd87dde426db0ae40677e1c2c', CAST(N'2025-03-20T01:19:08.033' AS DateTime), NULL, 1, NULL, NULL, NULL)
SET IDENTITY_INSERT [dbo].[usuario] OFF
GO
ALTER TABLE [dbo].[cliente]  WITH CHECK ADD  CONSTRAINT [FK_cliente_tipoIdentificacion] FOREIGN KEY([tipoIdentificacion])
REFERENCES [dbo].[tipoIdentificacion] ([id])
GO
ALTER TABLE [dbo].[cliente] CHECK CONSTRAINT [FK_cliente_tipoIdentificacion]
GO
ALTER TABLE [dbo].[cliente]  WITH CHECK ADD  CONSTRAINT [FK_cliente_usuario] FOREIGN KEY([usuarioCreacion])
REFERENCES [dbo].[usuario] ([id])
GO
ALTER TABLE [dbo].[cliente] CHECK CONSTRAINT [FK_cliente_usuario]
GO
ALTER TABLE [dbo].[detalleFactura]  WITH CHECK ADD  CONSTRAINT [FK_detalle_factura_producto] FOREIGN KEY([productoId])
REFERENCES [dbo].[producto] ([id])
GO
ALTER TABLE [dbo].[detalleFactura] CHECK CONSTRAINT [FK_detalle_factura_producto]
GO
ALTER TABLE [dbo].[detalleFactura]  WITH CHECK ADD  CONSTRAINT [FK_detalleFactura_factura] FOREIGN KEY([id])
REFERENCES [dbo].[factura] ([id])
GO
ALTER TABLE [dbo].[detalleFactura] CHECK CONSTRAINT [FK_detalleFactura_factura]
GO
ALTER TABLE [dbo].[factura]  WITH CHECK ADD  CONSTRAINT [FK_factura_cliente] FOREIGN KEY([clienteId])
REFERENCES [dbo].[cliente] ([id])
GO
ALTER TABLE [dbo].[factura] CHECK CONSTRAINT [FK_factura_cliente]
GO
ALTER TABLE [dbo].[factura]  WITH CHECK ADD  CONSTRAINT [FK_factura_tipo_pago] FOREIGN KEY([tipoPagoId])
REFERENCES [dbo].[tipoPago] ([id])
GO
ALTER TABLE [dbo].[factura] CHECK CONSTRAINT [FK_factura_tipo_pago]
GO
ALTER TABLE [dbo].[factura]  WITH CHECK ADD  CONSTRAINT [FK_factura_tipoIdentificacion] FOREIGN KEY([tipoIdentificacionCliente])
REFERENCES [dbo].[tipoIdentificacion] ([id])
GO
ALTER TABLE [dbo].[factura] CHECK CONSTRAINT [FK_factura_tipoIdentificacion]
GO
ALTER TABLE [dbo].[factura]  WITH CHECK ADD  CONSTRAINT [FK_factura_usuario] FOREIGN KEY([usuarioId])
REFERENCES [dbo].[usuario] ([id])
GO
ALTER TABLE [dbo].[factura] CHECK CONSTRAINT [FK_factura_usuario]
GO
ALTER TABLE [dbo].[producto]  WITH CHECK ADD  CONSTRAINT [FK_producto_usuario] FOREIGN KEY([usuarioCreacion])
REFERENCES [dbo].[usuario] ([id])
GO
ALTER TABLE [dbo].[producto] CHECK CONSTRAINT [FK_producto_usuario]
GO
USE [master]
GO
ALTER DATABASE [gestionFacturas] SET  READ_WRITE 
GO
