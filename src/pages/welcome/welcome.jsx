import { useNavigate } from 'react-router-dom';

import LogoWelcome from '../../components/logoWelcome';
import LanguageSwitcher from '../../components/languageSwitcher';
import { useLanguage } from '../../hooks/useLanguage';
import { translations } from '../../utils/translations';
import './welcome.css';

export default function Welcome() {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const content = translations.welcome[language];

    return (
        <main className="welcome-page">
            <header className="welcome-header">
                <LanguageSwitcher />
            </header>
            <section className="welcome-main">
                <div className="welcome-content">
                    <LogoWelcome />
                    <h1>{content.title}</h1>
                    <p>{content.subtitle}</p>
                </div>
                <button className="start-button" type="button" onClick={() => navigate('/home')}>
                    {content.startButton}
                </button>
            </section>
        </main>
    );
}