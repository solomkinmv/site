import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Search, BookmarkCheck, Globe, WifiOff, Moon, Layers } from "lucide-react";

const appStoreUrl =
    "https://apps.apple.com/ua/app/%D0%BC%D0%B5%D0%B4%D0%B8%D1%87%D0%BD%D1%96-%D0%BA%D0%BE%D0%B4%D0%B8/id6758305387";

export const metadata: Metadata = {
    title: "Медичні Коди — АКМІ та МКХ-10 для iOS",
    description:
        "Безкоштовний iOS-додаток для пошуку медичних кодів АКМІ (ACHI) та МКХ-10 (ICD-10). Понад 23 000 кодів офлайн, українською та англійською.",
    other: {
        "apple-itunes-app": "app-id=6758305387",
    },
};

export default function MedichniKodiPage() {
    return (
        <div className="max-w-3xl mx-auto" lang="uk">
            {/* Hero */}
            <section className="flex flex-col items-center text-center py-8">
                <Image
                    src="/images/apps/medical-codes/icon.webp"
                    alt="Medical Codes app icon"
                    width={128}
                    height={128}
                    className="rounded-[28px] shadow-lg"
                />
                <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Медичні Коди
                </h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 max-w-md">
                    Довідник кодів АКМІ та МКХ-10 у вашому iPhone. Понад 23 000
                    медичних кодів офлайн.
                </p>
                <Link
                    href={appStoreUrl}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-white text-sm font-medium hover:bg-gray-800 transition-colors dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                    <svg viewBox="0 0 384 512" className="h-5 w-5 fill-current">
                        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                    </svg>
                    Завантажити в App Store
                </Link>
            </section>

            {/* Screenshots */}
            <section className="py-8 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Image
                        src="/images/apps/medical-codes/achi-main.webp"
                        alt="Огляд класів АКМІ"
                        width={300}
                        height={650}
                        className="rounded-xl shadow-md"
                    />
                    <Image
                        src="/images/apps/medical-codes/idc-10-main.webp"
                        alt="Огляд класів МКХ-10"
                        width={300}
                        height={650}
                        className="rounded-xl shadow-md"
                    />
                    <Image
                        src="/images/apps/medical-codes/achi-single.webp"
                        alt="Деталі коду процедури"
                        width={300}
                        height={650}
                        className="rounded-xl shadow-md"
                    />
                    <Image
                        src="/images/apps/medical-codes/achi-bookmarks.webp"
                        alt="Збережені коди"
                        width={300}
                        height={650}
                        className="rounded-xl shadow-md"
                    />
                </div>
            </section>

            {/* Features */}
            <section className="py-8 border-t border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                    Можливості
                </h2>
                <div className="grid gap-6 sm:grid-cols-2">
                    <Feature
                        icon={<Layers className="h-5 w-5" />}
                        title="Два класифікатори"
                        description="АКМІ (6 728 кодів процедур) та МКХ-10 (16 960 кодів діагнозів) в одному додатку."
                    />
                    <Feature
                        icon={<WifiOff className="h-5 w-5" />}
                        title="Повністю офлайн"
                        description="Усі дані зберігаються на пристрої. Працює без інтернету."
                    />
                    <Feature
                        icon={<Search className="h-5 w-5" />}
                        title="Швидкий пошук"
                        description="Миттєвий пошук за кодом або назвою процедури чи діагнозу."
                    />
                    <Feature
                        icon={<BookmarkCheck className="h-5 w-5" />}
                        title="Закладки"
                        description="Зберігайте потрібні коди для швидкого доступу."
                    />
                    <Feature
                        icon={<Globe className="h-5 w-5" />}
                        title="Двомовність"
                        description="Назви кодів українською та англійською мовами."
                    />
                    <Feature
                        icon={<Moon className="h-5 w-5" />}
                        title="Темна тема"
                        description="Підтримка світлої та темної теми оформлення."
                    />
                </div>
            </section>

            {/* About classifiers */}
            <section className="py-8 border-t border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Про класифікатори
                </h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-400">
                    <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                            АКМІ (НК 026:2021)
                        </h3>
                        <p className="mt-1">
                            Австралійський класифікатор медичних інтервенцій.
                            Структурований довідник кодів із 20 класів за анатомічним
                            принципом. Гармонізовано з ACHI 10-ї редакції.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                            МКХ-10 (НК 025:2021)
                        </h3>
                        <p className="mt-1">
                            Міжнародна класифікація хвороб 10-го перегляду.
                            Структурований довідник із 22 класів захворювань.
                            Гармонізовано з МКХ-10-АМ (Австралійська модифікація).
                        </p>
                    </div>
                    <p className="text-sm">
                        Обидва класифікатори затверджено наказом Міністерства економіки
                        України від 04.08.2021 № 360-21. Чинні з 01.09.2021.
                    </p>
                </div>
            </section>

            {/* Support */}
            <section
                id="support"
                className="py-8 border-t border-gray-200 dark:border-gray-700"
            >
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Підтримка
                </h2>
                <div className="space-y-3 text-gray-600 dark:text-gray-400">
                    <p>
                        Маєте питання, пропозиції чи зауваження? Напишіть нам:
                    </p>
                    <p>
                        <Link
                            href="mailto:support+achi@solomk.in?subject=Медичні Коди — Підтримка"
                            className="text-violet-600 dark:text-violet-400 hover:underline"
                        >
                            support+achi@solomk.in
                        </Link>
                    </p>
                    <p>
                        Розробник:{" "}
                        <Link
                            href="https://solomk.in"
                            className="text-violet-600 dark:text-violet-400 hover:underline"
                        >
                            solomk.in
                        </Link>
                    </p>
                </div>
            </section>
        </div>
    );
}

function Feature({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="flex gap-3">
            <div className="flex-shrink-0 mt-0.5 text-violet-600 dark:text-violet-400">
                {icon}
            </div>
            <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    {title}
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {description}
                </p>
            </div>
        </div>
    );
}
