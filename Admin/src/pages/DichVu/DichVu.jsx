import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DichVu.css";

const DichVu = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editServiceId, setEditServiceId] = useState(null);

  const [formData, setFormData] = useState({
    serviceName: "",
    price: "",
    serviceType: "",
    status: "Đang hoạt động",
  });

  const API_URL = "https://localhost:7182/api/Service";

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setServices(res.data);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
      alert("Không thể tải danh sách dịch vụ!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSearch = async () => {
    if (!search.trim()) {
      fetchServices();
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      const filtered = res.data.filter((s) =>
        s.serviceName.toLowerCase().includes(search.toLowerCase())
      );
      setServices(filtered);
    } catch (err) {
      console.error("Lỗi tìm kiếm:", err);
      alert("Không thể tìm kiếm dịch vụ!");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearch("");
    fetchServices();
  };


  const handleAddClick = () => {
    setFormData({
      serviceName: "",
      price: "",
      serviceType: "",
      status: "Đang hoạt động",
    });
    setIsEditing(false);
    setEditServiceId(null);
    setShowModal(true);
  };

  const handleEditClick = (svc) => {
    setFormData({
      serviceName: svc.serviceName,
      price: svc.price.toString(),
      serviceType: svc.serviceType,
      status: svc.status,
    });
    setEditServiceId(svc.serviceId);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
      };

      if (isEditing) {
        await axios.put(`${API_URL}/${editServiceId}`, {
          serviceId: editServiceId,
          ...payload,
        });
        alert("Cập nhật dịch vụ thành công!");
      } else {
        await axios.post(API_URL + "/add-service", payload);
        alert("Thêm dịch vụ thành công!");
      }

      setShowModal(false);
      setFormData({
        serviceName: "",
        price: "",
        serviceType: "",
        status: "Đang hoạt động",
      });
      fetchServices();
    } catch (err) {
      console.error(err);
      alert("Không thể lưu dịch vụ!");
    }
  };

  return (
    <div className="checkin-wrapper">
      <div className="checkin-header">
        <input
          type="text"
          placeholder="Nhập tên dịch vụ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="btn-checkin btn-search"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "Đang tìm..." : "Tìm kiếm"}
        </button>
        <button className="btn-checkin btn-reset" onClick={handleReset}>
          Đặt lại
        </button>
        <button className="btn-add" onClick={handleAddClick}>
          + Thêm dịch vụ
        </button>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div className="table-container">
          <table className="service-table">
            <thead>
              <tr>
                <th style={{ display: "none" }}>Mã</th>
                <th>Tên dịch vụ</th>
                <th>Giá (VNĐ)</th>
                <th>Loại dịch vụ</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {services.map((svc) => (
                <tr key={svc.serviceId}>
                  <td style={{ display: "none" }}>{svc.serviceId}</td>
                  <td>{svc.serviceName}</td>
                  <td>{svc.price.toLocaleString("vi-VN")}</td>
                  <td>{svc.serviceType}</td>
                  <td>{svc.status}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEditClick(svc)}
                    >
                      Sửa
                    </button>
                  </td>
                </tr>
              ))}
              {services.length === 0 && !loading && (
                <tr>
                  <td colSpan="6">Không tìm thấy dịch vụ nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{isEditing ? "Sửa dịch vụ" : "Thêm dịch vụ mới"}</h3>
            <form onSubmit={handleSubmit}>
              <label>
                Tên dịch vụ:
                <input
                  type="text"
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Giá:
                <input
                  type="text"
                  name="price"
                  value={
                    formData.price
                      ? Number(formData.price).toLocaleString("vi-VN")
                      : ""
                  }
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[.,\s]/g, "");
                    if (/^\d*$/.test(raw)) {
                      setFormData({ ...formData, price: raw });
                    }
                  }}
                  required
                />
              </label>
              <label>
                Loại dịch vụ:
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Chọn loại dịch vụ --</option>
                  <option value="Đồ ăn">Đồ ăn</option>
                  <option value="Nước uống">Nước uống</option>
                  <option value="Khác">Khác</option>
                </select>
              </label>
              <label>
                Trạng thái:
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Đang hoạt động">Đang hoạt động</option>
                  <option value="Ngừng hoạt động">Ngừng hoạt động</option>
                </select>
              </label>

              <div className="modal-buttons">
                <button type="submit" className="btn-save">
                  Lưu
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DichVu;
