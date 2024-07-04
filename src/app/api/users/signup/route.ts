import connectDB from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/utils/mailer";

connectDB();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { username, email, password } = reqBody;

    let user = await User.findOne({ $or: [{ username }, { email }] });

    if (user) {
      return NextResponse.json({ error: "User already exists", status: 400 });
    }

    const salt = bcryptjs.genSaltSync(10);
    const hash = bcryptjs.hashSync(password, salt);

    const newUser = new User({
      username,
      email,
      password: hash,
    });

    const createdUser = await newUser.save();
    const resUserObj = createdUser.toObject();

    delete resUserObj.password;

    // send verification email
    await sendEmail({ email, emailType: "VERIFY", userId: createdUser._id });

    return NextResponse.json({
      message: "User registered successfully",
      success: true,
      status: 201,
      resUserObj,
    });

    //
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}
