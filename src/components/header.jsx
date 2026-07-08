import LanguageSwitcher from '../../components/languageSwitcher';
import VehicleTabs from './vehicleTabs';

function Header() {
    return (
        <header className="header">
            <LogoGroup />
            <VehicleTabs />
            <LanguageSwitcher />
        </header>
    );
}