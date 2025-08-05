import WebApp from "@twa-dev/sdk";
import logo from "../assets/logo.png";
import user from "../api/User";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Splash = () => {
    const [trigger, { data }] = user.LoginUser();
    const navigate = useNavigate();

    useEffect(() => {
        // Ждем инициализации Telegram Mini App
        const timer = setTimeout(() => {
            // Проверяем, что мы в Telegram Mini App и есть initData
            if (WebApp.platform === "unknown" || !WebApp.initData) {
                // Если не в Telegram или нет initData, показываем ошибку
                console.error("Telegram Mini App not initialized properly");
                return;
            } else {
                // В Telegram используем реальные данные
                trigger({ key: WebApp.initData });
            }
        }, 1000); // Ждем 1 секунду для инициализации

        return () => clearTimeout(timer);
    }, [trigger]);

    useEffect(() => {
        if (data?.token) {
            sessionStorage.setItem("token", data.token);
            navigate("/app", { replace: true });
        }
    }, [data?.token, navigate]);

    return (
        <div style={{ background: `${WebApp.themeParams.bg_color}` }} className="flex items-center justify-center min-h-screen relative">
            <img src={logo} className="w-40" alt="logo from logo" />
            <span className="loading loading-spinner loading-lg absolute bottom-5 left-[50%] -translate-x-[50%]"></span>
        </div>
    );
};

export default Splash;