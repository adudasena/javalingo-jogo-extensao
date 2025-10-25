import "./globals.css";
import "./styles.css";
import "./NivelamentoPopup.css";

export const metadata = {
  title: "JavaLingo",
  description: "Jogo de aprendizado de Java interativo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#0f0f10] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
