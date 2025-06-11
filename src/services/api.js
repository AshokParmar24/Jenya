import axiosInstance from "./axios";

export const signInUser = (payload) => {
  return axiosInstance.post("user/login", payload);
};

export const singUpUser = (payload) => {
  return axiosInstance.post("users/add", payload);
};

export const getProductList = (payload) => {
  return axiosInstance.get("products", payload);
};

 

 

 

export const deleteProuctApi = (id, payload) => {
  return axiosInstance.delete(`products/${id}`, payload);
};

