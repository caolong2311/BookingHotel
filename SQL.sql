-- ===============================
-- Tạo database HotelManagement
-- ===============================
CREATE DATABASE Hotel;
GO
USE Hotel;
GO

-- ===============================
-- Bảng RoomTypes: Loại phòng
-- ===============================
CREATE TABLE RoomTypes (
    RoomTypeID INT IDENTITY(1,1) PRIMARY KEY,
    TypeName NVARCHAR(50) NOT NULL,
    TotalRooms INT NOT NULL,
    BasePrice DECIMAL(10,2) NOT NULL,
	BedDescription NVARCHAR(50),
    MaxOccupancy INT NOT NULL,
	Area int not null,
    Description NVARCHAR(255),
	Image NVARCHAR(255)
);

INSERT INTO RoomTypes (TypeName, TotalRooms, BasePrice, BedDescription, MaxOccupancy, Area, Description, Image)
VALUES
('Standard', 20, 1400000, '02 single beds', 4, 25, N'Phòng Standard được thiết kế với trang thiết bị hiện đại, wifi tốc độ cao, Smart TV, két an toàn, bồn tắm, điều hòa trung tâm.', 'https://hotel-apartment.theshinehotel.vn/upload/attachment/9502s2suptw01.jpg'),
('Superior', 15, 1600000, '01 king bed / 02 single beds', 4, 28, N'Phòng hạng ưu được thiết kế với trang thiết bị hiện đại, wifi tốc độ cao, Smart TV, két an toàn, bồn tắm, điều hòa trung tâm.', 'https://hotel-apartment.theshinehotel.vn/upload/attachment/5482s2supdb04.jpg'),
('Deluxe', 15, 1800000,  '01 king bed / 02 single beds', 4, 30, N'Phòng Deluxe được thiết kế đặc biệt với ngập tràn ánh sáng tự nhiên, bạn có thể ngắm nhìn con đường đẹp nhất thành phố cùng cảng biển, được trang bị tiện nghi hiện đại, là lựa chọn lý tưởng cho chuyến công tác, du lịch của bạn.', 'https://hotel-apartment.theshinehotel.vn/upload/attachment/4380s2dluxdb05.jpg'),
('Executive', 5, 2000000,  '01 king bed', 2, 45, N'Phòng Executive có không gian cực ấn tượng với tầm nhìn rộng, hướng ra cảng biển, sân bay, cầu vượt lung linh khi thành phố lên đèn, được trang bị tiện nghi hiện đại, cho bạn những trải nghiệm đáng nhớ.', 'https://hotel-apartment.theshinehotel.vn/upload/attachment/4342s2exe03.jpg');

update RoomTypes
set MaxOccupancy = 2
where TypeName = 'Standard'
-- ===============================
-- Bảng Rooms: Danh sách phòng vật lý
-- ===============================
CREATE TABLE Rooms (
    RoomID INT IDENTITY(1,1) PRIMARY KEY,
    RoomNumber NVARCHAR(10) NOT NULL,
    RoomTypeID INT NOT NULL,
    Status NVARCHAR(20) DEFAULT 'Available', -- Available, Occupied, Maintenance
    CONSTRAINT FK_Rooms_RoomTypes FOREIGN KEY (RoomTypeID) REFERENCES RoomTypes(RoomTypeID)
);

-- Standard (20 phòng)
INSERT INTO Rooms (RoomNumber, RoomTypeID)
VALUES
('101', 1), ('102', 1), ('103', 1), ('104', 1), ('105', 1),
('106', 1), ('107', 1), ('108', 1), ('109', 1), ('110', 1),
('111', 1), ('112', 1), ('113', 1), ('114', 1), ('115', 1),
('116', 1), ('117', 1), ('118', 1), ('119', 1), ('120', 1);

-- Superior (15 phòng)
INSERT INTO Rooms (RoomNumber, RoomTypeID)
VALUES
('201', 2), ('202', 2), ('203', 2), ('204', 2), ('205', 2),
('206', 2), ('207', 2), ('208', 2), ('209', 2), ('210', 2),
('211', 2), ('212', 2), ('213', 2), ('214', 2), ('215', 2);

-- Deluxe (15 phòng)
INSERT INTO Rooms (RoomNumber, RoomTypeID)
VALUES
('301', 3), ('302', 3), ('303', 3), ('304', 3), ('305', 3),
('306', 3), ('307', 3), ('308', 3), ('309', 3), ('310', 3),
('311', 3), ('312', 3), ('313', 3), ('314', 3), ('315', 3);

-- Executive (5 phòng)
INSERT INTO Rooms (RoomNumber, RoomTypeID)
VALUES
('401', 4), ('402', 4), ('403', 4), ('404', 4), ('405', 4);


-- ===============================
-- Bảng Customers: Thông tin khách hàng
-- ===============================
CREATE TABLE Customers (
    CustomerID INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100),
    PhoneNumber NVARCHAR(20)
);

INSERT INTO Customers(FullName, Email, PhoneNumber, IdentityNumber)
VALUES
(N'Nguyen Van A', 'a@gmail.com', '0901234567', '123456789'),
(N'Tran Thi B', 'b@gmail.com', '0902345678', '987654321');

-- ===============================
-- Bảng Bookings: Thông tin đặt phòng
-- ===============================
CREATE TABLE Bookings (
    BookingID INT IDENTITY(1,1) PRIMARY KEY,
    CustomerID INT NOT NULL,
    RoomTypeID INT NOT NULL,
    RoomID INT NULL,
    CheckInDate DATE NOT NULL,
    CheckOutDate DATE NOT NULL,
    NumGuests INT DEFAULT 1,
    Status NVARCHAR(20) DEFAULT 'Pending', -- Pending, Confirmed, CheckedIn, CheckedOut, Cancelled
    TotalPrice DECIMAL(12,2),
    CONSTRAINT FK_Bookings_Customers FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID),
    CONSTRAINT FK_Bookings_RoomTypes FOREIGN KEY (RoomTypeID) REFERENCES RoomTypes(RoomTypeID),
    CONSTRAINT FK_Bookings_Rooms FOREIGN KEY (RoomID) REFERENCES Rooms(RoomID)
);
ALTER TABLE Bookings
ADD PaymentMethod NVARCHAR(20);
-- 1. Xóa default constraint
ALTER TABLE Bookings
DROP CONSTRAINT DF__Bookings__NumGue__52593CB8;

-- 2. Xóa cột
ALTER TABLE Bookings
DROP COLUMN NumGuests;

INSERT INTO Bookings(CustomerID, RoomTypeID, CheckInDate, CheckOutDate, NumGuests, Status, TotalPrice)
VALUES
(1, 2, '2025-09-01', '2025-09-03', 2, 'Confirmed', 4000000),
(2, 1, '2025-09-02', '2025-09-04', 1, 'Pending', 2000000);

-- ===============================
-- Bảng Services: Dịch vụ thêm
-- ===============================
CREATE TABLE Services (
    ServiceID INT IDENTITY(1,1) PRIMARY KEY,
    ServiceName NVARCHAR(50) NOT NULL,   -- Tên món/đồ uống/dịch vụ
    Price INT NOT NULL,                   -- Giá
    ServiceType NVARCHAR(20) NOT NULL,    -- Loại: Food, Drink, Laundry
    Status NVARCHAR(20) DEFAULT 'Available'  -- Tình trạng
);

INSERT INTO Services (ServiceName, Price, ServiceType, Status) VALUES
-- Món ăn
(N'Phở bò', 120000, 'Food', 'Available'),
(N'Cơm gà', 100000, 'Food', 'Available'),
(N'Bún chả', 110000, 'Food', 'Available'),

-- Đồ uống
(N'Cà phê sữa', 30000, 'Drink', 'Available'),
(N'Coca', 10000, 'Drink', 'Available'),
(N'Nước ép cam', 40000, 'Drink', 'Available'),

-- Dịch vụ giặt là
('Giặt quần áo', 80000, N'Khác', 'Available')


-- ===============================
-- Bảng BookingServices: Gắn dịch vụ vào booking
-- ===============================
CREATE TABLE BookingServices (
    BookingServiceID INT IDENTITY(1,1) PRIMARY KEY,
    BookingID INT NOT NULL,
    ServiceID INT NOT NULL,
    Quantity INT DEFAULT 1,        -- số suất dịch vụ
    Status NVARCHAR(20) DEFAULT 'Pending', -- Pending, Completed
    CONSTRAINT FK_BookingServices_Bookings FOREIGN KEY (BookingID) REFERENCES Bookings(BookingID),
    CONSTRAINT FK_BookingServices_Services FOREIGN KEY (ServiceID) REFERENCES Services(ServiceID)
);

-- Thêm dữ liệu mẫu
INSERT INTO BookingServices(BookingID, ServiceID, Quantity)
VALUES
(1, 1, 2),  -- 2 suất ăn sáng
(1, 2, 1),  -- 1 gói giặt ủi
(2, 1, 1);  -- 1 suất ăn sáng
CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,  -- ID tự tăng
    UserName NVARCHAR(50) NOT NULL,  
    Password NVARCHAR(255) NOT NULL,         -- Mật khẩu
	-- Tên người dùng
    Role NVARCHAR(20) NOT NULL,             -- Vai trò: Admin, Staff, Guest...
);
INSERT INTO Users (UserName, Password, Role)
VALUES 
('Admin', 'Admin', 'Admin'),
('User1', 'User1', 'User'),
('User2', 'User2', 'User');