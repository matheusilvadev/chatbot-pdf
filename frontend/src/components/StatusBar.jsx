export default function StatusBar({ pdfLoaded }) {
  if (pdfLoaded) {
    return <div className="status-bar loaded">PDF carregado — pode fazer perguntas</div>;
  }
  return <div className="status-bar idle">Nenhum PDF carregado</div>;
}
