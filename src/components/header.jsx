import LanguageSwitcher from '../../components/languageSwitcher';

function Header() {
    return (
        <header className="home-header">
            <div className="home-header-left">
                <LogoGroup />
            </div>
            <div className="home-header-right">
                <LanguageSwitcher />
            </div>
        </header>
    );
}