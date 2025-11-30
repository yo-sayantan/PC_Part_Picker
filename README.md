# PC Part Picker - India Edition

> An intelligent PC building assistant for the Indian market with real-time price tracking, compatibility checking, and visual assembly interface.

## 🚀 Features

### Core Functionality
- **Visual Drag-and-Drop Assembly**: Interactive 3D-style workspace where you can visually build your PC by dragging components
- **Real-time Compatibility Checking**: Smart validation ensures all components work together
  - CPU-Motherboard socket compatibility
  - RAM type validation
  - GPU clearance checks
  - PSU wattage calculations
  - Case fitment verification
- **Live Price Tracking**: Web scraping from major Indian retailers
  - Amazon India
  - MDComputers
  - More retailers coming soon
- **Email Build Summary**: Share your build configuration via email

### Technical Highlights
- **Database-backed**: SQLite with Prisma ORM for persistent storage
- **Modern Stack**: Next.js 14, React 18, TypeScript
- **Beautiful UI**: Tailwind CSS with custom dark theme
- **Production Ready**: Docker support with standalone builds

## 📋 Prerequisites

- **Node.js** 20.x or higher
- **npm** or **pnpm**
- **Docker** (optional, for containerized deployment)
- **Git** for version control

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yo-sayantan/PC_Part_Picker.git
cd PC_Part_Picker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# SMTP Email Configuration (for build summaries)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**Note**: For Gmail, you need an [App Password](https://myaccount.google.com/apppasswords), not your regular password.

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Initialize database
npx prisma db push
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## 🐳 Docker Deployment

### Production Build

```bash
# Build the Docker image
docker-compose build

# Run the container
docker-compose up
```

The app will be available at `http://localhost:3000`

### Development Mode with Docker

For development with hot-reload:

```bash
docker-compose -f docker-compose.dev.yml up
```

## 📁 Project Structure

```
PC_Part_Picker/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── api/               # API routes
│   │   │   ├── email/         # Email sending endpoint
│   │   │   └── parts/         # Parts data endpoints
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── AssemblyZone.tsx   # Visual PC builder
│   │   ├── BuilderWorkspace.tsx
│   │   ├── EmailModal.tsx
│   │   ├── PartsLibrary.tsx
│   │   └── StatsPanel.tsx
│   └── lib/                   # Utilities
│       ├── compatibility.ts   # Compatibility checking logic
│       ├── db.ts             # Database client
│       └── scraper/          # Web scrapers
│           ├── amazon.ts
│           └── mdcomputers.ts
├── prisma/
│   └── schema.prisma          # Database schema
├── Dockerfile                 # Production container
├── docker-compose.yml         # Production compose
├── docker-compose.dev.yml     # Development compose
├── .env.example              # Environment template
└── package.json              # Dependencies

```

## 🎯 Usage Guide

### Building a PC

1. **Select Components**: Browse the parts library on the left sidebar
2. **Drag & Drop**: Drag components onto the assembly zone
3. **Check Compatibility**: The stats panel automatically validates your build
4. **Review Pricing**: See real-time prices from various retailers
5. **Email Summary**: Click "Email Build Summary" to share your configuration

### Adding New Parts

Parts can be added via the Prisma database or API endpoints. Example:

```typescript
// Add a new CPU
await prisma.part.create({
  data: {
    name: "Intel Core i7-13700K",
    categoryId: "cpu-category-id",
    imageUrl: "https://...",
    specs: JSON.stringify({
      socket: "LGA1700",
      tdp: 125,
      integrated_graphics: true
    })
  }
});
```

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

### Database Management

```bash
npx prisma studio    # Open database GUI
npx prisma generate  # Regenerate Prisma client
npx prisma db push   # Sync schema to database
```

## 🌐 Web Scraping

The app includes scrapers for:

- **Amazon India**: Price tracking for PC components
- **MDComputers**: Popular Indian PC parts retailer

Scrapers use Puppeteer for dynamic content rendering. In production Docker containers, Chromium is included.

## ⚙️ Configuration

### Tailwind CSS

Configured for dark mode with custom color palette. See `tailwind.config.ts`

### Next.js

- **Output**: Standalone (optimized for Docker)
- **Environment**: `.env` file loaded automatically
- **API Routes**: RESTful endpoints under `/api`

## 🔒 Security

- **Environment Variables**: Never commit `.env` to version control
- **Secrets Management**: Use secure App Passwords for SMTP
- **CORS**: Configure appropriately for production
- **Input Validation**: Sanitize user inputs and scraped data

## 🐛 Troubleshooting

### Common Issues

**Build fails with "Cannot find module 'autoprefixer'"**
```bash
npm install -D autoprefixer
```

**Docker build fails with Puppeteer errors**
- Ensure Chromium is installed in the container (already configured in Dockerfile)

**Database errors**
```bash
npx prisma generate
npx prisma db push
```

**ESLint peer dependency warnings**
- These are warnings from eslint-config-next version mismatches but don't affect builds

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is provided as-is for educational and personal use.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI powered by [Tailwind CSS](https://tailwindcss.com/)
- Drag-and-drop via [@dnd-kit](https://dndkit.com/)
- Database with [Prisma](https://www.prisma.io/)

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Made with ❤️ for the Indian PC building community**
