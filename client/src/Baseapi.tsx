import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

const BaseApi = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL || "https://telegram-mini-app-todo-list.onrender.com"
    }),
    endpoints: () => ({})
});

export default BaseApi;