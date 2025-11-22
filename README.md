# Social Support Application with AI Assistance

A modern, responsive web application for citizens to apply for financial assistance with AI-powered writing assistance.

## Features

- **3-Step Form Wizard**: Multi-step application form with progress tracking
- **AI Assistance**: OpenAI GPT integration to help users write descriptions
- **Multi-language Support**: English and Arabic (RTL) language support
- **Responsive Design**: Works on mobile, tablet, and desktop devices
- **Accessibility**: ARIA roles, keyboard navigation, and screen reader support
- **Local Storage**: Automatically saves form progress
- **Form Validation**: Comprehensive validation with error messages

## Tech Stack

- **React.js** - UI framework
- **Material UI** - Component library
- **React Hook Form** - Form handling
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **React-i18next** - Internationalization
- **Vite** - Build tool

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd social-support-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Project Structure

```
social-support-app/
├── src/
│   ├── components/
│   │   ├── steps/
│   │   │   ├── Step1PersonalInfo.jsx
│   │   │   ├── Step2FamilyFinancial.jsx
│   │   │   └── Step3SituationDescriptions.jsx
│   │   ├── AIModal.jsx
│   │   └── FormWizard.jsx
│   ├── i18n/
│   │   └── config.js
│   ├── services/
│   │   └── openaiService.js
│   ├── store/
│   │   ├── slices/
│   │   │   ├── formSlice.js
│   │   │   └── uiSlice.js
│   │   └── store.js
│   ├── utils/
│   │   ├── localStorage.js
│   │   └── validation.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Form Steps

### Step 1: Personal Information
- Name, National ID, Date of Birth, Gender
- Address, City, State, Country
- Phone, Email

### Step 2: Family & Financial Info
- Marital Status, Dependents
- Employment Status, Monthly Income
- Housing Status

### Step 3: Situation Descriptions
- Current Financial Situation (with AI assistance)
- Employment Circumstances (with AI assistance)
- Reason for Applying (with AI assistance)

## AI Integration

The application uses OpenAI's GPT-3.5-turbo model to help users write descriptions for Step 3 fields. Click the "Help Me Write" button next to any textarea field to generate AI-powered suggestions.

The AI considers context from other form fields (employment status, income, housing, etc.) to provide relevant suggestions.

## Language Support

The application supports English and Arabic. Click the language icon in the header to switch languages. Arabic mode includes RTL (right-to-left) layout support.

## Accessibility

- ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- Focus indicators
- Semantic HTML

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is licensed under the MIT License.

