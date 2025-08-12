'use client';
export default function Footer() {
  return (
    <footer className="bg-muted/30 mt-20 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
                <span className="text-primary-foreground text-xl">緒</span>
              </div>
              <span className="font-bold">Issho</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Making group meetings simple and efficient for teams worldwide.
            </p>
          </div>
          <div>
            <h4 className="mb-3 font-semibold">Product</h4>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Integrations
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold">Company</h4>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold">Support</h4>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Privacy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-muted-foreground mt-8 border-t pt-8 text-center text-sm">
          <p>&copy; 2025 Issho. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
