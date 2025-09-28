import { prisma } from "@/src/lib/prisma"

export const pesquisaBiblica = async (nome_livro: string, capitulo_livro: string, ip: string) => {
    await prisma.pesquisa.create({
        data: {
            nome_livro,
            capitulo_livro,
            ip
        }
    })
}