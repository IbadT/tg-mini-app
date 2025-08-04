import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

const BaseApi = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://telegram-mini-app-todo-list.onrender.com"
    }),
    endpoints: () => ({})
});

export default BaseApi;