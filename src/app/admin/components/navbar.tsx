// Lembre-se que este arquivo precisa ser um Componente de Cliente
"use client";

import React from "react";
// 1. Importação correta dos componentes do NextUI
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenuToggle,
} from "@heroui/navbar";
import Link from "next/link";
import { logout } from "@/src/services/auth";
import { useRouter } from "next/navigation";

export default function NavBar() {
    const router = useRouter()    

    // Função de placeholder para o logout
    const handleLogout = async () => {
        await logout()
            .then(()=> {
                router.push('/admin/login')
            })
    };

    return (
        <Navbar isBordered position="sticky" className="relative">
            <NavbarContent justify="start" className="w-full">
                <NavbarBrand>
                    <p className="font-bold text-inherit">Contexto Bíblico</p>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent
                className="hidden sm:flex gap-6 absolute left-1/2 -translate-x-1/2"
                justify="center"
            >
                <NavbarItem>
                    <Link color="foreground" href="#">
                        Comentário
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link href="#" color="foreground">
                        Referência Bíblica
                    </Link>
                </NavbarItem>

                <NavbarItem className="hidden sm:flex">
                    <Link href="#" onClick={handleLogout}>
                        Sair
                    </Link>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}