import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function formatDate(dateString) {
    if (!dateString) return ""; // Kiểm tra nếu không có giá trị

    const date = new Date(dateString);
    if (isNaN(date)) return "Ngày không hợp lệ"; // Kiểm tra nếu ngày không hợp lệ

    const day = date.getDate().toString().padStart(2, "0"); // Lấy ngày (DD)
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Lấy tháng (MM)
    const year = date.getFullYear(); // Lấy năm (YYYY)

    return `${day}-${month}-${year}`;
};

export const removeLocalStorageWhenLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");      
    localStorage.removeItem("auth");      
}

export const getRandomColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

export const getInitials = (fullName) => {
    if (!fullName) return "";
  
    return fullName
      .trim()
      .split(/\s+/) // tách theo khoảng trắng
      .map(word => word[0].toUpperCase())
      .join("");
  }
  