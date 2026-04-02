import bcrypt from "bcryptjs"

export const hashValue= async (val:string, salt:number=10) => {
    return await bcrypt.hash(val, salt);
}

export const compareHash= async (val: string, hash: string) => {
    return await bcrypt.compare(val, hash);
}