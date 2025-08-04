import { prisma } from "..";
import { CatchAsync } from "../utils/Utilite";
import { isValid, parse } from '@telegram-apps/init-data-node';
import jwt from "jsonwebtoken";

const create_user = CatchAsync(async (req, res) => {
    console.log("=== USER LOGIN REQUEST ===");
    console.log("Body:", req?.body);
    console.log("Headers:", req?.headers);
    
    const { key } = req?.body;
    
    // Fallback для разработки
    if (!key || key === "dev-key") {
        console.log("Development mode - creating mock user");
        
        if (!process.env.SECRET) {
            console.log("ERROR: SECRET not set");
            throw new Error("SECRET not configured");
        }

        // Создаем мокового пользователя для разработки
        const mockUser = await prisma.user.findFirst({
            where: { tgId: "dev-user-123" }
        });

        let user;
        if (mockUser) {
            user = mockUser;
            console.log("Mock user found:", user.id);
        } else {
            user = await prisma.user.create({
                data: {
                    name: "Development User",
                    tgId: "dev-user-123",
                    username: "dev_user",
                    referCode: "dev-user-123",
                    referBy: "0",
                }
            });
            console.log("Mock user created:", user.id);
        }

        const token = jwt.sign(user, process.env.SECRET as string);
        console.log("JWT token generated for dev user");
        
        res.send({ token: token });
        return;
    }

    if (!process.env.BOT_TOKEN) {
        console.log("ERROR: BOT_TOKEN not set");
        throw new Error("BOT_TOKEN not configured");
    }

    if (!process.env.SECRET) {
        console.log("ERROR: SECRET not set");
        throw new Error("SECRET not configured");
    }

    if (!isValid(key, process.env.BOT_TOKEN as string)) {
        console.log("ERROR: Invalid Telegram init data");
        throw new Error("not come from authorized source.");
    }

    const parseValue = parse(key);
    console.log("Parsed Telegram data:", parseValue);

    const tx = await prisma.$transaction(async (tx) => {
        const user = await prisma.user.findFirst({
            where: {
                tgId: String(parseValue?.user?.id)
            }
        });

        if (user) {
            console.log("User found:", user.id);
            return user;
        }

        console.log("Creating new user...");
        const val = await prisma.user.create({
            data: {
                name: parseValue?.user?.first_name + " " + parseValue?.user?.last_name,
                tgId: String(parseValue?.user?.id),
                username: parseValue?.user?.username,
                referCode: String(parseValue?.user?.id),
                referBy: "0",
            }
        });

        console.log("New user created:", val.id);
        return val;
    });

    const token = jwt.sign(tx, process.env.SECRET as string);
    console.log("JWT token generated");

    res.send({ token: token });
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