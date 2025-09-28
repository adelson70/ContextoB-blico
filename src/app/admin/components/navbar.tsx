"use client";

import React, { useState } from "react";
import Link from "next/link";
import { logout } from "@/src/services/auth";
import { useRouter } from "next/navigation";
import ComentarioModal from "./ComentarioModal";
import ReferenciaModal from "./ReferenciaModal";
import { Menu, X, BookOpen, Link as LinkIcon, LogOut } from "lucide-react";

export default function NavBar() {
    const router = useRouter();
    const [isComentarioModalOpen, setIsComentarioModalOpen] = useState(false);
    const [isReferenciaModalOpen, setIsReferenciaModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Função de placeholder para o logout
    const handleLogout = async () => {
        await logout()
            .then(()=> {
                router.push('/admin/login')
            })
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <nav className="bg-white dark:bg-slate-800 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center items-center h-16 relative">

                        {/* Desktop Navigation - Centralizado */}
                        <div className="hidden md:block">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setIsComentarioModalOpen(true)}
                                    className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                                >
                                    <BookOpen className="w-4 h-4 mr-2" />
                                    Comentário
                                </button>
                                <button
                                    onClick={() => setIsReferenciaModalOpen(true)}
                                    className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                                >
                                    <LinkIcon className="w-4 h-4 mr-2" />
                                    Referência Bíblica
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Sair
                                </button>
                            </div>
                        </div>

                        {/* Mobile menu button - Posicionado à direita */}
                        <div className="md:hidden absolute right-0">
                            <button
                                onClick={toggleMobileMenu}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
                                aria-expanded="false"
                            >
                                <span className="sr-only">Abrir menu principal</span>
                                {isMobileMenuOpen ? (
                                    <X className="block h-6 w-6" />
                                ) : (
                                    <Menu className="block h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => {
                                    setIsComentarioModalOpen(true);
                                    closeMobileMenu();
                                }}
                                className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                            >
                                <BookOpen className="w-5 h-5 mr-3" />
                                Comentário
                            </button>
                            <button
                                onClick={() => {
                                    setIsReferenciaModalOpen(true);
                                    closeMobileMenu();
                                }}
                                className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                            >
                                <LinkIcon className="w-5 h-5 mr-3" />
                                Referência Bíblica
                            </button>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    closeMobileMenu();
                                }}
                                className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200"
                            >
                                <LogOut className="w-5 h-5 mr-3" />
                                Sair
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Modais */}
            <ComentarioModal 
                isOpen={isComentarioModalOpen}
                onClose={() => setIsComentarioModalOpen(false)}
            />
            <ReferenciaModal 
                isOpen={isReferenciaModalOpen}
                onClose={() => setIsReferenciaModalOpen(false)}
            />
        </>
    );
}