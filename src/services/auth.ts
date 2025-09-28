'use server'

import bcrypt from "bcryptjs";
import { prisma } from "@/src/lib/prisma";
import { setAuthCookies, clearAuthCookies } from "../util/jwt.util";

export async function login(email: string, senha: string) {
    if (!email) throw Error('Email não informado')
    if (!senha) throw Error('Senha não informado')

    const usuario = await prisma.usuario.findFirst({
        where: {
            email
        }
    });

    if (!usuario) throw new Error('Usuario não encontrado')

    const senhaComparada = await bcrypt.compare(senha, usuario?.senha)

    if (!senhaComparada) throw new Error('Senha não coincide')

    const payload = {
        userId: usuario.id
    }

    await setAuthCookies(payload)

}

export function logout() {
    return clearAuthCookies()
}