import React, { useEffect, useState } from "react";
import axios from "axios";


const KhachHang = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const API_URL = "https://localhost:7182/api/Customer";


  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setCustomers(res.data);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
      alert("Không thể tải danh sách khách hàng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);


  const handleSearch = async () => {
    if (!search.trim()) {
      fetchCustomers();
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      const filtered = res.data.filter((c) =>
        c.phoneNumber.toLowerCase().includes(search.toLowerCase())
      );
      setCustomers(filtered);
    } catch (err) {
      console.error("Lỗi tìm kiếm:", err);
      alert("Không thể tìm kiếm khách hàng!");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearch("");
    fetchCustomers();
  };

  return (
    <div className="checkin-wrapper">
      <div className="checkin-header">
        <input
          type="text"
          placeholder="Nhập số điện thoại khách hàng..."
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
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div className="table-container">
          <table className="service-table">
            <thead>
              <tr>
                <th style={{ display: "none" }}>Mã KH</th>
                <th>Họ và tên</th>
                <th>Số điện thoại</th>
                <th>Email</th>
                <th>Tình trạng</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {customers.map((c) => (
                <tr key={c.customerId}>
                  <td style={{ display: "none" }}>{c.customerId}</td>
                  <td>{c.fullName}</td>
                  <td>{c.phoneNumber}</td>
                  <td>{c.email}</td>
                  <td>{c.bookingStatus}</td>
                </tr>
              ))}
              {customers.length === 0 && !loading && (
                <tr>
                  <td colSpan="5">Không tìm thấy khách hàng nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default KhachHang;
