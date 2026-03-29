import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">
              Dwyrex
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Modern web teknolojileri ile yazılım dünyasını keşfedin.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
              Sayfalar
            </h4>
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                className="text-gray-500 dark:text-gray-400 hover:text-blue-500 transition"
              >
                Ana Sayfa
              </Link>
              <Link
                href="/blog"
                className="text-gray-500 dark:text-gray-400 hover:text-blue-500 transition"
              >
                Blog
              </Link>
              <Link
                href="/hakkimda"
                className="text-gray-500 dark:text-gray-400 hover:text-blue-500 transition"
              >
                Hakkımda
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
              İletişim
            </h4>
            <div className="flex flex-col gap-2 text-gray-500 dark:text-gray-400">
              <span>info@dwyrex.com</span>
              <span>github.com/dwyrex</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center text-gray-400 dark:text-gray-500">
          <p>&copy; 2025 Dwyrex. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}