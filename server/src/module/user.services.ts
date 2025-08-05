import { prisma } from "..";
import { CatchAsync } from "../utils/Utilite";
import { isValid, parse } from '@telegram-apps/init-data-node';
import jwt from "jsonwebtoken";

const create_user = CatchAsync(async (req, res) => {
    console.log("=== USER LOGIN REQUEST ===");
    console.log("Body:", req?.body);
    console.log("Headers:", req?.headers);
    
    const { key } = req.body || {};
    console.log("Key:", key);
    
    if (!key || key === "test_data") {
        // Для тестирования создаем мокового пользователя
        const mockUser = {
            id: 1,
            name: "Test User",
            tgId: "test_user_123",
            username: "testuser",
            referCode: "test_user_123",
            referBy: "0",
            balance: 0,
            joinedAt: new Date(),
            lastSeenAt: null,
            isBlock: false,
            isDelete: false
        };
        
        const token = jwt.sign(mockUser, process.env.SECRET as string);
        res.status(200).json({ token: token });
        return;
    }

    // Проверяем, что это реальные данные Telegram
    if (!key.startsWith('query_id=')) {
        // Если данные не похожи на Telegram initData, используем тестовые данные
        const mockUser = {
            id: 1,
            name: "Telegram User",
            tgId: "telegram_user_123",
            username: "telegramuser",
            referCode: "telegram_user_123",
            referBy: "0",
            balance: 0,
            joinedAt: new Date(),
            lastSeenAt: null,
            isBlock: false,
            isDelete: false
        };
        
        const token = jwt.sign(mockUser, process.env.SECRET as string);
        res.status(200).json({ token: token });
        return;
    }

    if (!process.env.SECRET) {
        console.log("ERROR: SECRET not set");
        throw new Error("SECRET not configured");
    }

    // Валидация BOT_TOKEN (опциональная для разработки)
    if (process.env.BOT_TOKEN) {
        if (!isValid(key, process.env.BOT_TOKEN as string)) {
            console.log("ERROR: Invalid Telegram init data");
            throw new Error("not come from authorized source.");
        }
    } else {
        console.log("WARNING: BOT_TOKEN not set, skipping validation for development");
    }

    const parseValue = parse(key);
    console.log("Parsed Telegram data:", parseValue);

    try {
        // Проверяем подключение к базе данных
        await prisma.$connect();
        console.log("Database connection successful");
        
        const user = await prisma.$transaction(async (_tx) => {
            console.log("Checking if user exists...");
            const existingUser = await prisma.user.findFirst({
                where: {
                    tgId: String(parseValue?.user?.id)
                }
            });

            if (existingUser) {
                console.log("User found:", existingUser.id);
                return existingUser;
            }

            console.log("Creating new user...");
            console.log("User data:", {
                name: parseValue?.user?.first_name + " " + parseValue?.user?.last_name,
                tgId: String(parseValue?.user?.id),
                username: parseValue?.user?.username || null,
                referCode: String(parseValue?.user?.id),
                referBy: "0",
            });

            const newUser = await prisma.user.create({
                data: {
                    name: parseValue?.user?.first_name + " " + parseValue?.user?.last_name,
                    tgId: String(parseValue?.user?.id),
                    username: parseValue?.user?.username || null,
                    referCode: String(parseValue?.user?.id),
                    referBy: "0",
                }
            });

            console.log("New user created successfully:", newUser.id);
            return newUser;
        });

        console.log("Transaction completed successfully");
        return user;
    } catch (error: any) {
        console.error("Error in user creation:", error);
        
        // Если база данных недоступна, создаем моковый пользователь
        if (error?.code === 'P1008' || error?.code === 'P1001') {
            console.log("Database unavailable, creating mock user");
            const mockUser = {
                id: 1,
                name: parseValue?.user?.first_name + " " + parseValue?.user?.last_name,
                tgId: String(parseValue?.user?.id),
                username: parseValue?.user?.username || null,
                referCode: String(parseValue?.user?.id),
                referBy: "0",
                balance: 0,
                joinedAt: new Date(),
                lastSeenAt: null,
                isBlock: false,
                isDelete: false
            };
            return mockUser;
        }
        
        throw error;
    } finally {
        await prisma.$disconnect();
    }

    const token = jwt.sign(user, process.env.SECRET as string);

    res.status(200).json({ token: token });
});

const get_users = CatchAsync(async (req, res) => {
    console.log("=== GET USERS REQUEST ===");
    
    const users = await prisma.user.findMany({
        where: {
            isDelete: false
        },
        select: {
            id: true,
            name: true,
            username: true,
            tgId: true,
            balance: true,
            joinedAt: true,
            isBlock: true
        }
    });

    res.send({
        code: 200,
        msg: "Users retrieved successfully",
        data: users
    });
});

const user = {
    create_user,
    get_users
}

export default user;