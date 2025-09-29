import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Payment = () => {
  const navigate = useNavigate();
  const hasCalled = useRef(false);

  useEffect(() => {
    if (hasCalled.current) return; 
    hasCalled.current = true;

    const bookingData = JSON.parse(localStorage.getItem("pendingBooking"));

    if (!bookingData) {
      navigate("/");
      return;
    }

    const callBookingApi = async () => {
      try {
        const response = await axios.post(
          "https://localhost:7182/api/booking",
          bookingData,
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.status === 200) {
          alert(response.data.Message || "Đặt phòng thành công!");
          localStorage.removeItem("pendingBooking");
          navigate("/");
        } else {
          alert(response.data.Message || "Đặt phòng thất bại!");
          console.error(response.data);
        }
      } catch (error) {
        console.error(error);
        alert("Lỗi kết nối server!");
      }
    };

    callBookingApi();
  }, [navigate]);

  return <h2>Đang xử lý thanh toán...</h2>;
};

export default Payment;
