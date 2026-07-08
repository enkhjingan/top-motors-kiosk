import LogoGroup from './logoGroup';
import LanguageSwitcher from './languageSwitcher';
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

export default Header;