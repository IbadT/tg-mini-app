import { prisma } from "..";
import { CatchAsync } from "../utils/Utilite";
import { isValid, parse } from '@telegram-apps/init-data-node';
import jwt from "jsonwebtoken";

const create_user = CatchAsync(async (req, res) => {
    console.log("=== USER LOGIN REQUEST ===");
    console.log("Body:", req?.body);
    console.log("Headers:", req?.headers);
    
    const { key } = req.body || {};
    
    if (!key) {
        console.log("ERROR: No init data provided");
        throw new Error("Telegram init data is required");
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

    const user = await prisma.$transaction(async (_tx) => {
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
                username: parseValue?.user?.username || null,
                referCode: String(parseValue?.user?.id),
                referBy: "0",
            }
        });

        console.log("New user created:", val.id);
        return val;
    });

    const token = jwt.sign(user, process.env.SECRET as string);
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