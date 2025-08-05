import { prisma } from "..";
import { CatchAsync } from "../utils/Utilite";
import { isValid, parse } from '@telegram-apps/init-data-node';
import jwt from "jsonwebtoken";

const create_user = CatchAsync(async (req, res) => {
    console.log("=== USER LOGIN REQUEST ===");
    console.log("Body:", req?.body);
    console.log("Headers:", req?.headers);
    
    const { key } = req.body || {};
    
    if (!key || key === "test_data") {
        // Для тестирования, возвращаем ошибку - нужны реальные данные
        res.status(400).json({ error: 'Real Telegram data required' });
        return;
    }

    // Проверяем, что это реальные данные Telegram
    if (!key.includes('user=') || !key.includes('auth_date=')) {
        // Если данные не похожи на Telegram initData, возвращаем ошибку
        res.status(400).json({ error: 'Invalid Telegram data' });
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
        
        const token = jwt.sign(user, process.env.SECRET as string);
        res.status(200).json({ token: token });
    } catch (error) {
        console.error("Error in user creation:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
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

const get_user_profile = CatchAsync(async (req, res) => {
    console.log("=== GET USER PROFILE REQUEST ===");
    
    // Получаем токен из заголовка
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'No token provided' });
        return;
    }
    
    const token = authHeader.substring(7);
    
    try {
        // Декодируем токен
        const decoded = jwt.verify(token, process.env.SECRET as string) as { tgId: string };
        
        // Находим пользователя в базе данных
        const user = await prisma.user.findFirst({
            where: {
                tgId: decoded.tgId
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
        
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        
        res.json({
            code: 200,
            msg: "User profile retrieved successfully",
            data: user
        });
    } catch(error: unknown) {
        console.error("Error in user profile retrieval:", error);
        res.status(401).json({ error: 'Invalid token' });
    }
});

const user = {
    create_user,
    get_users,
    get_user_profile
}

export default user;