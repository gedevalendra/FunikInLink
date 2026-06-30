export default function Footer() {
  return (
    <footer className="w-full bg-gray-50 border-t border-gray-100 px-[5%] py-6 mt-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Sisi Kiri: Logo & Copyright */}
        <div className="flex flex-col items-center sm:items-start gap-1">
          <h2 className="font-bold text-base flex items-center">
            Funik<span className="text-yellow-500">In</span>
            <span className="ml-1 text-xs font-normal text-gray-500">Link</span>
          </h2>
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} FunikIn Dev. All rights reserved.
          </p>
        </div>

        {/* Sisi Kanan: Sosial Media / Link Singkat */}
        <div className="flex items-center gap-4 text-gray-500 text-lg">
          <a 
            href="https://instagram.com/funikin" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-yellow-500 transition-colors"
          >
            <i className="bx bxl-instagram"></i>
          </a>
          <a 
            href="https://github.com/funikin" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-yellow-500 transition-colors"
          >
            <i className="bx bxl-github"></i>
          </a>
          <a 
            href="https://linkedin.com/funikin" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-yellow-500 transition-colors"
          >
            <i className="bx bxl-linkedin"></i>
          </a>
        </div>

      </div>
    </footer>
  );
}