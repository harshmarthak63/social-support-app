# Social Support Application with AI Assistance

A modern, responsive web application for citizens to apply for financial assistance with AI-powered writing assistance. Built with React.js, Material UI, and integrated with OpenAI and Mistral AI.

## Features

- **3-Step Form Wizard**: Multi-step application form with progress tracking and visual stepper
- **Smart AI Assistance**: Mistral AI with automatic OpenAI fallback to help users write professional descriptions
- **Multi-language Support**: Full English and Arabic (RTL) language support with seamless switching
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Accessibility**: ARIA roles, keyboard navigation, and screen reader support
- **Form Validation**: Comprehensive real-time validation with helpful error messages
- **Progress Saving**: Automatic form progress saving to local storage
- **Mock API Integration**: Ready-to-use mock API for testing form submission
- **Loading States**: Visual feedback with loading masks during AI generation and form submission
- **Modern UI**: Beautiful gradient designs, smooth animations, and intuitive user experience

## Tech Stack

- **React.js** - UI framework
- **Material UI (MUI)** - Component library and theming
- **React Hook Form** - Efficient form handling and validation
- **Redux Toolkit** - State management
- **Axios** - HTTP client for API calls
- **React-i18next** - Internationalization (i18n)
- **Vite** - Fast build tool and dev server
- **OpenAI API** - GPT-3.5-turbo for AI text generation
- **Mistral AI API** - Mistral-small model for alternative AI assistance

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key (optional, for OpenAI assistance)
- Mistral AI API key (optional, for Mistral assistance)

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
VITE_MISTRAL_API_KEY=your_mistral_api_key_here
```

**Note**: At least one API key (Mistral AI or OpenAI) is recommended for AI assistance. The application will automatically use the available service with smart fallback. If both are missing, AI assistance features will be unavailable.

4. Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:3000` (or the port shown in the terminal).

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

To preview the production build:
```bash
npm run preview
```

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
│   │   ├── FormWizard.jsx
│   │   └── SubmissionModal.jsx
│   ├── i18n/
│   │   └── config.js
│   ├── services/
│   │   ├── apiService.js
│   │   ├── openaiService.js
│   │   └── mistralService.js
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
├── .gitignore
└── README.md
```

## Form Steps

### Step 1: Personal Information
- Name, National ID, Date of Birth, Gender
- Address, City, State, Country
- Phone Number, Email Address

### Step 2: Family & Financial Information
- Marital Status, Number of Dependents
- Employment Status, Monthly Income
- Housing Status

### Step 3: Situation Descriptions
- Current Financial Situation (with AI assistance)
- Employment Circumstances (with AI assistance)
- Reason for Applying (with AI assistance)

## AI Integration

The application uses a smart fallback system with two AI providers:

### Primary: Mistral AI
- Primary AI provider for text generation
- Uses mistral-small model
- Requires `VITE_MISTRAL_API_KEY` in `.env` file

### Fallback: OpenAI GPT-3.5-turbo
- Automatic fallback if Mistral AI fails
- Uses GPT-3.5-turbo model for text generation
- Requires `VITE_OPENAI_API_KEY` in `.env` file

### How It Works
1. Click the "Help Me Write" button (✨ icon + text) next to any textarea field in Step 3
2. The system first attempts to generate a suggestion using Mistral AI
3. If Mistral AI fails (API key missing, rate limit, network error, etc.), it automatically falls back to OpenAI
4. If both services fail, an appropriate error message is displayed
5. The AI considers context from other form fields (employment status, income, housing, marital status, dependents)
6. A modal opens with the AI-generated suggestion
7. Review and edit the suggestion as needed
8. Click "Accept" to add it to the form field, or "Discard" to close without saving

**Note**: At least one API key (Mistral or OpenAI) is required for AI assistance to work. The application will automatically use the available service.

## Language Support

The application fully supports English and Arabic:

- **English (LTR)**: Default language with left-to-right layout
- **Arabic (RTL)**: Right-to-left layout with proper text direction
- **Language Switcher**: Click the language icon in the header to toggle between languages
  - Shows "Arabic" when in English mode
  - Shows "English" when in Arabic mode
- **Persistent**: Language preference is maintained during the session

## Form Submission

The application includes a mock API service for testing form submission:

- **Mock API**: Simulates network delay (1-2 seconds) and returns a success response
- **Loading State**: Shows a loading mask during submission
- **Success Modal**: Beautiful modal dialog displays after successful submission with:
  - Application ID
  - Submission status
  - Submission timestamp
  - Success message
  - Complete form data (formatted JSON) for review
- **Error Handling**: Comprehensive error handling for network issues, timeouts, and server errors
- **Form Reset**: Automatically resets the form after successful submission
- **Data Logging**: Form data is logged to console and displayed in the submission modal

To use a real API, update `src/services/apiService.js` and replace `submitApplicationMock` with `submitApplication`.

## Accessibility

- **ARIA Labels**: All interactive elements have proper ARIA labels
- **Keyboard Navigation**: Full keyboard support for form navigation
- **Screen Reader Support**: Compatible with screen readers
- **Focus Indicators**: Clear focus indicators for keyboard users
- **Semantic HTML**: Proper use of semantic HTML elements
- **Color Contrast**: WCAG compliant color contrast ratios

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linter (if configured)

### State Management

The application uses Redux Toolkit for state management:

- **Form State** (`formSlice`): Manages form data across all steps
- **UI State** (`uiSlice`): Manages loading states, AI modal, language, and submission status

### Local Storage

Form progress is automatically saved to local storage. The form data is cleared:
- On page reload (fresh start)
- After successful submission

## Error Handling

The application includes comprehensive error handling for:

- **API Errors**: Invalid API keys, rate limits, server errors
- **Network Errors**: Connection issues, timeouts
- **Validation Errors**: Form field validation with user-friendly messages
- **User Feedback**: Clear error messages displayed to users

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or contributions, please open an issue on the GitHub repository.
