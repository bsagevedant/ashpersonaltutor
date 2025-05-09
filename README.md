# Ash Personal Tutor

A modern web application built with Next.js that provides personalized tutoring capabilities. This application leverages AI to create an interactive and engaging learning experience.

## Features

- Modern, responsive UI built with Next.js and Tailwind CSS
- AI-powered tutoring capabilities
- Real-time interaction and feedback
- Markdown support for rich content
- Toast notifications for user feedback
- Type-safe development with TypeScript

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: 
  - Headless UI
  - Radix UI
  - Lucide React icons
- **AI Integration**: 
  - OpenAI
  - Together AI
- **Development Tools**:
  - ESLint
  - Prettier
  - TypeScript

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd ash-personal-tutor
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add necessary environment variables.

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## Project Structure

```
ash-personal-tutor/
├── app/              # Next.js app directory
├── components/       # Reusable React components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and configurations
├── public/          # Static assets
└── utils/           # Helper functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- All other open-source contributors whose work made this project possible 