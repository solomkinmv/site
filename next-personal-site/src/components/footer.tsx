import React from 'react';
import {cn} from "@/lib/utils";

export const Footer = () => {
    return (
        <footer className={cn('fixed', 'inset-x-0', 'bottom-0', 'flex', 'justify-center', 'items-center', 'h-12', 'bg-gray-800', 'text-white')}>
            © 2024 Maksym Solomkin
        </footer>
    );
};
