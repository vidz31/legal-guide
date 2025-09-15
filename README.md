# NyaySaar - AI Legal Guide

A comprehensive AI-powered platform that makes legal documents easy to understand through intelligent analysis, risk detection, and multilingual support.

## Features

### 🔍 Document Analysis
- **OCR Processing**: Upload PDFs, Word documents, or scanned images
- **AI Summarization**: Get plain language summaries of complex legal documents
- **Risk Detection**: Automatically identify and categorize risky clauses
- **Interactive Highlights**: Click on highlighted text for detailed explanations

### 💬 Conversational Q&A
- **AI Chat Interface**: Ask questions about your documents in natural language
- **Contextual Responses**: Get answers based on your specific document content
- **Sample Questions**: Pre-built questions to help you get started

### 📊 Document Comparison
- **Side-by-Side Analysis**: Compare multiple documents across key categories
- **Risk Comparison**: Visual comparison of risk levels between documents
- **Smart Recommendations**: AI-powered suggestions on which document is better

### 🌐 Multilingual Support
- **English & Hindi**: Full interface and responses in both languages
- **Language Toggle**: Switch between languages seamlessly
- **Localized Content**: All text properly translated and culturally appropriate

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **UI Components**: Radix UI primitives with custom styling
- **AI Integration**: Mock AI responses (ready for real AI API integration)
- **Styling**: Custom design system with semantic color tokens
- **Deployment**: Vercel-ready configuration

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd nyaaysaar-mvp
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Key Components

### DocumentUpload
Handles file uploads with drag-and-drop support, progress tracking, and mock AI processing simulation.

### DocumentSummary  
Displays AI-generated summaries with interactive risk highlighting and detailed explanations.

### ChatInterface
Conversational Q&A interface with contextual responses and sample questions.

### DocumentComparison
Side-by-side document comparison with intelligent recommendations.

### Multilingual System
Complete translation system supporting English and Hindi with easy extensibility.

## Demo Flow

1. **Upload Document**: Drag and drop a legal document or use sample documents
2. **View Summary**: See AI-generated plain language summary with risk highlights
3. **Ask Questions**: Use the chat interface to ask specific questions about clauses
4. **Compare Documents**: Upload multiple documents to compare terms and risks
5. **Switch Languages**: Toggle between English and Hindi for full localization

## Customization

### Adding New Languages
1. Add translations to `lib/translations.ts`
2. Update the `Language` type
3. Add language option to `LanguageToggle` component

### Integrating Real AI APIs
Replace mock functions in components with actual API calls to:
- OpenAI/GPT for summarization and Q&A
- Google Document AI for OCR
- Google Translate API for multilingual support

### Styling Customization
Modify design tokens in `app/globals.css` to change:
- Color scheme
- Typography
- Spacing and sizing
- Component styling

## Production Deployment

The application is ready for deployment on Vercel:

1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy with default settings

For other platforms, build the application:
\`\`\`bash
npm run build
npm start
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is built for educational and demonstration purposes. Please ensure compliance with relevant legal and privacy regulations when handling real legal documents.

## Support

For questions or support, please open an issue in the repository or contact the development team.
