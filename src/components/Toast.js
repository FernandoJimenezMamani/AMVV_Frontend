import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/Toast.css';  
 
const CustomToast = () => {
  return (
    <ToastContainer
      position="bottom-center"
      autoClose={1000}
      hideProgressBar
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      toastClassName="custom-toast"
      bodyClassName="custom-toast-body"
      closeButtonClassName="custom-toast-close"
    />
  );
};
 
export default CustomToast;
 
 