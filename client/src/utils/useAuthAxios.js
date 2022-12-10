import axios from "axios";

const useAuthAxios = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  const authAxios = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return authAxios;
};

export default useAuthAxios;
