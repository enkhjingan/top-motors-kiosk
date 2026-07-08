import { useNavigate } from 'react-router-dom';

import LogoWelcome from '../../components/logoWelcome';
import LanguageSwitcher from '../../components/languageSwitcher';
import { useLanguage } from '../../hooks/useLanguage';
import { translations } from '../../utils/translations';
import './welcome.css';
import LogoGroup from '../../components/logoGroup';


function Header() {
    return (
        <header className="welcome-header">
            <LogoGroup/>
            <LanguageSwitcher />
        </header>
    );
}
export default function Welcome() {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const content = translations.welcome[language];

    return (
        <main className="welcome-page">
            <Header />
            <section className="welcome-main">
                <div className="welcome-content">
                    <p>{content.subtitle}</p>
                    <h1>{content.title}</h1>
                    <button className="start-button" type="button" onClick={() => navigate('/home')}>
                        {content.startButton}
                    </button>
                </div>
            </section>
        </main>
    );
}