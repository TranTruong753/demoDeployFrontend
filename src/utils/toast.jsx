import { ToastContainer, toast } from 'react-toastify';

export const showToastMessage = (mes, type = 'default', position = 'top-right') => {
  toast(mes, {
    type: type, // Sử dụng type như một thuộc tính trong options
    position: position,
    autoClose: 1000, // hiển thị trong 2 giây (hoặc ít hơn)
  });
};

export const showToastMessagePlus = (
  mes,
  type = 'default',
  position = 'top-right',
  autoClose = 2000, // mặc định 2s
  theme = 'light', // light | dark | colored
  pauseOnHover = true,
  hideProgressBar = false,
  closeOnClick = true
) => {
  toast(mes, {
    type: type,
    position: position,
    autoClose: autoClose,
    theme: theme,
    pauseOnHover: pauseOnHover,
    hideProgressBar: hideProgressBar,
    closeOnClick: closeOnClick,
  });
};

export const showToastMessagePlus2 = ({
  title = '',
  description = '',
  type = 'default',
  position = 'top-right',
  autoClose = 2000,
  theme = 'light',
  pauseOnHover = true,
  hideProgressBar = false,
  closeOnClick = true,
}) => {
  toast(
    <div>
      <strong>{title}</strong>
      <div>{description}</div>
    </div>,
    {
      type,
      position,
      autoClose,
      theme,
      pauseOnHover,
      hideProgressBar,
      closeOnClick,
    }
  );
};