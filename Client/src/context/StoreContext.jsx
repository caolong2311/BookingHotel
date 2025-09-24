import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const url = "https://localhost:7182";
    const [rooms, setRooms] = useState([])

    const fetchRoomType = async () => {
        try {
            const res = await axios.get(`${url}/RoomType`);
            setRooms(res.data);
        } catch (error) {
            console.error("Lỗi tải phòng:", error);
        }
    };
    useEffect(() => {
        const init = async () => {
            await fetchRoomType();
        };
        init();
    }, []);
    const contextValue = {
        rooms
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
