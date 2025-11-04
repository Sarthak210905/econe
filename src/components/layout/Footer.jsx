export default function Footer() {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            © 2025 EcoNE. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-600 hover:text-green-600 text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-600 hover:text-green-600 text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-gray-600 hover:text-green-600 text-sm">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
