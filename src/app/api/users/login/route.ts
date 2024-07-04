import connectDB from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connectDB();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { username, password } = reqBody;

    const user = await User.findOne({ username });

    if (!user) {
      return NextResponse.json({
        error: "User doesnt exists",
        status: 400,
      });
    }
    console.log("User exists");
    const validPassword = await bcryptjs.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json({
        error: "Incorrect password",
        status: 400,
      });
    }
    const payload = {
      id: user._id,
      username: user.username,
    };
    const token = jwt.sign(payload, process.env.TOKEN_SECRET!, {
      expiresIn: "24h",
    });

    const response = NextResponse.json({
      message: "Logged In Successfully",
      success: true,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}
