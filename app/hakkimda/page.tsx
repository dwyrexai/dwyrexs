import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkımda",
  description: "Dwyrex hakkında bilgi edinin.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="animate-fade-in">
        {/* Profile */}
        <div className="text-center mb-16">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl">
            👨‍💻
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Merhaba, Ben{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Dwyrex
            </span>
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Full-stack web geliştirici. Modern web teknolojileri ile projeler
            geliştiriyorum.
          </p>
        </div>

        {/* Skills */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Teknolojiler</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[
              "React",
              "Next.js",
              "TypeScript",
              "Node.js",
              "Tailwind CSS",
              "Supabase",
              "PostgreSQL",
              "Git",
            ].map((skill) => (
              <div
                key={skill}
                className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-center hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1"
              >
                {skill}
              </div>
            ))}
          </div>
        </div>

        {/* About Text */}
        <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 sm:p-10">
          <h2 className="text-2xl font-bold mb-6">Hakkımda</h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
            <p>
              Yazılım geliştirme tutkusuyla başlayan yolculuğumda, modern web
              teknolojilerini kullanarak kullanıcı dostu ve performanslı
              uygulamalar geliştiriyorum.
            </p>
            <p>
              Bu blogda öğrendiklerimi, deneyimlerimi ve keşfettiklerimi
              paylaşıyorum. Amacım, yazılım dünyasına ilgi duyan herkese
              faydalı içerikler sunmak.
            </p>
            <p>
              Herhangi bir sorunuz veya iş birliği teklifiniz varsa benimle
              iletişime geçebilirsiniz.
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-6">İletişim</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:info@dwyrex.com"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25"
            >
              📧 Email Gönder
            </a>
            <a
              href="https://github.com/dwyrex"
              target="_blank"
              className="px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-gray-700"
            >
              🐙 GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}