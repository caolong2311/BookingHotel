import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CheckOut.css";

const CheckOut = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomDetail, setRoomDetail] = useState(null);

  const [showServicePopup, setShowServicePopup] = useState(false);
  const [serviceList, setServiceList] = useState([]);
  const [selectedServices, setSelectedServices] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("Đồ ăn");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get("https://localhost:7182/api/Room");
        setRooms(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu phòng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleRoomClick = async (room) => {
    if (room.status === "Còn phòng") {
      setRoomDetail(null);
      alert(`Phòng ${room.roomNumber} chưa có người đặt!`);
      return;
    }

    try {
      const res = await axios.get(
        `https://localhost:7182/api/room/service?roomNumber=${room.roomNumber}`
      );
      setSelectedRoom(room);
      setRoomDetail(res.data);
    } catch (err) {
      console.error("Lỗi khi gọi API dịch vụ phòng:", err);
      alert("Không thể tải thông tin phòng này!");
    }
  };

  const handleAddService = async () => {
    try {
      const res = await axios.get("https://localhost:7182/api/service");
      setServiceList(res.data);
      setSelectedServices({});
      setSelectedCategory("Đồ ăn");
      setShowServicePopup(true);
    } catch (err) {
      console.error("Lỗi khi tải danh sách dịch vụ:", err);
      alert("Không thể tải danh sách dịch vụ!");
    }
  };

  const handleSelectService = (service) => {
    setSelectedServices((prev) => {
      const existing = prev[service.serviceId];
      return {
        ...prev,
        [service.serviceId]: existing
          ? { ...existing, quantity: existing.quantity + 1 }
          : { name: service.serviceName, quantity: 1 },
      };
    });
  };

  const handleIncrease = (id) => {
    setSelectedServices((prev) => ({
      ...prev,
      [id]: { ...prev[id], quantity: prev[id].quantity + 1 },
    }));
  };

  const handleDecrease = (id) => {
    setSelectedServices((prev) => {
      const current = prev[id];
      if (!current) return prev;
      if (current.quantity <= 1) {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      }
      return {
        ...prev,
        [id]: { ...current, quantity: current.quantity - 1 },
      };
    });
  };

  const handleQuantityChange = (id, quantity) => {
    setSelectedServices((prev) => ({
      ...prev,
      [id]: { ...prev[id], quantity: Number(quantity) },
    }));
  };

  const handleConfirmAdd = async () => {
    if (!roomDetail?.bookingDetailId) {
      alert("Không tìm thấy mã bookingDetail!");
      return;
    }

    const dataToSend = Object.entries(selectedServices)
      .filter(([_, item]) => item.quantity > 0)
      .map(([serviceId, item]) => ({
        bookingDetailId: roomDetail.bookingDetailId,
        serviceId: Number(serviceId),
        quantity: Number(item.quantity),
      }));

    if (dataToSend.length === 0) {
      alert("Vui lòng chọn ít nhất một dịch vụ!");
      return;
    }

    if (!window.confirm("Bạn có chắc chắn muốn thêm các dịch vụ này không?")) {
      return;
    }

    try {
      await axios.post(
        "https://localhost:7182/api/service/service-user",
        dataToSend,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      alert("Thêm dịch vụ thành công!");
      setShowServicePopup(false);
      handleRoomClick(selectedRoom);
    } catch (err) {
      console.error("Lỗi khi thêm dịch vụ:", err);
      alert("Thêm dịch vụ thất bại!");
    }
  };

  const handleCheckout = async () => {
    if (!roomDetail?.bookingDetailId) {
      alert("Không tìm thấy mã BookingDetail!");
      return;
    }

    if (!window.confirm(`Xác nhận trả phòng ${roomDetail.roomNumber}?`)) {
      return;
    }

    try {
      await axios.put(
        `https://localhost:7182/api/Room/check-out?bookingDetailId=${roomDetail.bookingDetailId}`
      );
      alert("Trả phòng thành công!");
      const res = await axios.get("https://localhost:7182/api/Room");
      setRooms(res.data);
      setRoomDetail(null);
      setSelectedRoom(null);
    } catch (err) {
      console.error("Lỗi khi trả phòng:", err);
      alert("Trả phòng thất bại!");
    }
  };


  if (loading) return <p>Đang tải dữ liệu phòng...</p>;

  return (
    <div className="checkout-container">
      <div className="room-section">
        <h2 className="checkout-title">Quản lý phòng</h2>
        <div className="room-grid">
          {rooms.map((room, index) => {
            const today = new Date().toISOString().split("T")[0];
            const checkoutDate = room.checkOutDate
              ? new Date(room.checkOutDate).toISOString().split("T")[0]
              : null;
            let cardClass = "room-card";
            let displayStatus = room.status;

            if (room.status === "Hết phòng") {
              if (checkoutDate === today) {
                cardClass += " today-checkout";
                displayStatus = "Trả phòng";
              } else {
                cardClass += " booked";
              }
            } else {
              cardClass += " available";
            }

            return (
              <div
                key={index}
                className={`${cardClass} ${selectedRoom?.roomNumber === room.roomNumber ? "selected" : ""
                  }`}
                onClick={() => handleRoomClick(room)}
              >
                <h3>{room.roomNumber}</h3>
                <p>{displayStatus}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="detail-section">
        {roomDetail ? (
          <>
            <div className="detail-header">
              <h3>
                Phòng {roomDetail.roomNumber} - {roomDetail.fullName}
              </h3>
              <p className="sub-info">
                <strong>Ngày nhận phòng:</strong>{" "}
                {new Date(roomDetail.checkInDate).toLocaleDateString("vi-VN")}
              </p>
              <p className="sub-info">
                <strong>Ngày trả phòng:</strong>{" "}
                {new Date(roomDetail.checkOutDate).toLocaleDateString("vi-VN")}
              </p>
            </div>

            <h4 className="service-title">Dịch vụ đã sử dụng</h4>
            <div className="service-table-container">
              <table className="service-table">
                <thead>
                  <tr>
                    <th>Tên dịch vụ</th>
                    <th>Số lượng</th>
                  </tr>
                </thead>
                <tbody>
                  {roomDetail.serviceList.length > 0 ? (
                    roomDetail.serviceList.map((s, i) => (
                      <tr key={i}>
                        <td>{s.serviceName}</td>
                        <td>{s.quantity}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="no-service">
                        Chưa có dịch vụ nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="total-section">
              <p>
                <strong>Tổng tiền:</strong>{" "}
                {roomDetail.total
                  ? roomDetail.total
                    .toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + "₫"
                  : "0₫"}
              </p>
            </div>
            <div className="action-buttons">
              <button className="btn add-btn" onClick={handleAddService}>
                Thêm dịch vụ
              </button>
              <button className="btn checkout-btn" onClick={handleCheckout}>
                Trả phòng
              </button>
            </div>
          </>
        ) : (
          <div className="placeholder-text">
            <p></p>
          </div>
        )}
      </div>

      {showServicePopup && (
        <div className="popup-overlay">
          <div className="popup enhanced-popup">
            <h3 className="popup-title">
              Thêm dịch vụ cho phòng {roomDetail?.roomNumber}
            </h3>

            <div className="popup-content">
              <div className="popup-left">
                <div className="service-tabs">
                  {["Đồ ăn", "Nước uống", "Khác"].map((cat) => (
                    <button
                      key={cat}
                      className={`tab-btn ${cat === selectedCategory ? "active" : ""
                        }`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="service-list">
                  {serviceList
                    .filter((s) => s.serviceType === selectedCategory)
                    .map((s) => (
                      <div key={s.serviceId} className="service-item">
                        <div className="service-info">
                          <span className="service-name">{s.serviceName}</span>
                          <span className="service-price">
                            {s.price?.toLocaleString()}₫
                          </span>
                        </div>
                        <button
                          className="btn small-btn select-btn"
                          onClick={() => handleSelectService(s)}
                        >
                          Chọn
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              <div className="popup-right">
                <h4>Dịch vụ đã chọn</h4>
                {Object.keys(selectedServices).length === 0 ? (
                  <p className="no-service">Chưa chọn dịch vụ nào</p>
                ) : (
                  <div className="selected-service-list">
                    {Object.entries(selectedServices).map(([id, item]) => (
                      <div key={id} className="selected-item">
                        <span>{item.name}</span>
                        <div className="quantity-control">
                          <button
                            onClick={() => handleDecrease(id)}
                            className="btn small-btn"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(id, e.target.value)
                            }
                            className="qty-input"
                          />
                          <button
                            onClick={() => handleIncrease(id)}
                            className="btn small-btn"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="popup-actions">
                  <button
                    className="btn cancel-btn"
                    onClick={() => setShowServicePopup(false)}
                  >
                    Hủy
                  </button>
                  <button className="btn confirm-btn" onClick={handleConfirmAdd}>
                    Xác nhận thêm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckOut;
