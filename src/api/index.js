import axios from "axios";

const axiosService = axios.create({
  headers: {
    ContentType: "application/json",
  },
});

axiosService.interceptors.request.use(async (config) => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (
    accessToken === null ||
    (accessToken.trim().length === 0 && accessToken.trim() === "")
  ) {
    window.location.href = "/";
  }

  config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

//access token 만료시 refresh token 사용
axiosService.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    const { config, response } = error;
    const originalRequest = config;
    if (response.status === 401) {
      const refreshToken = sessionStorage.getItem("refreshToken");
      const headers = { refreshToken: `${refreshToken}` };
      const result = await axiosService.post(
        "/api/user/refresh",
        {},
        { headers: headers }
      );
      const data = result.data;
      const status = result.status;

      if (status === 200) {
        sessionStorage.setItem("accessToken", data.data.accessToken);
        sessionStorage.setItem("refreshToken", data.data.refreshToken);
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return axios(originalRequest);
      }
    } else if (response.status >= 500) {
      console.log("500 error");
      window.location.href = "/error";
    } else {
      return error.response;
    }
  }
);

const deleteUser = async () => {
  return await axiosService.delete("/api/user");
};

const postCategoryAdd = async (categoryName) => {
  return await axiosService.post("/api/category", {
    categoryName: categoryName,
  });
};

const getCategoryList = async () => {
  return await axiosService.get("/api/category");
};

const patchCategoryEdit = async (category) => {
  return await axiosService.patch(`/api/category/${category.categoryId}`, {
    categoryName: category.categoryName,
  });
};

const deleteCategory = async (categoryId) => {
  return await axiosService.delete(`/api/category/${categoryId}`);
};

const patchCategoryOrder = async (orderedCategoryIds) => {
  return await axiosService.patch("/api/category", {
    orderedCategoryIds: orderedCategoryIds,
  });
};

const getAllLinkList = async (isMarked, categoryId) => {
  return await axiosService.get(
    `/api/link?isMarked=${isMarked}&categoryId=${categoryId}`
  );
};

const postLinkAdd = async (req) => {
  return await axiosService.post("/api/link", req);
};

const getLinkDetail = async (categoryId, timeStamp) => {
  return await axiosService.get(`/api/link/${categoryId}/${timeStamp}`);
};

const patchLinkBookmark = async (categoryId, timeStamp, isBookmark) => {
  return await axiosService.patch(
    `/api/link/${categoryId}/${timeStamp}/bookmark?isMarked=${isBookmark}`
  );
};

const deleteLink = async (categoryId, timeStamp) => {
  return await axiosService.delete(`/api/link/${categoryId}/${timeStamp}`);
};

const patchLinkEdit = async (req, categoryId, timeStamp) => {
  return await axiosService.patch(`/api/link/${categoryId}/${timeStamp}`, req);
};

const postLinkParse = async (url) => {
  return await axiosService.post("/api/link/parse", { url: url });
};

export {
  deleteUser,
  postCategoryAdd,
  getCategoryList,
  patchCategoryEdit,
  deleteCategory,
  patchCategoryOrder,
  getAllLinkList,
  postLinkAdd,
  getLinkDetail,
  patchLinkBookmark,
  deleteLink,
  patchLinkEdit,
  postLinkParse,
};
