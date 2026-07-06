import LogoGroup from '../../components/logoGroup';
import LanguageSwitcher from '../../components/languageSwitcher';
import './home.css';

const vehicleTabs = ['RAV4', 'LC300', 'LC250', 'LC70', 'Alphard', 'Hilux', 'Granvia'];

function Header() {
    return (
        <header className="home-header">
            <LogoGroup />
            <LanguageSwitcher />
        </header>
    );
}

function VehicleTabs() {
    return (
        <section className="vehicle-tabs" aria-label="Vehicle Tabs">
            <ul className="vehicle-tabs-list">
                {vehicleTabs.map((tab, index) => (
                    <li key={tab} className="vehicle-tabs-item">
                        <button
                            type="button"
                            className="vehicle-tabs-button"
                            aria-selected={index === 0}
                        >
                            {tab}
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
}

function HeroInfo() {
    return (
        <section className="hero-info" aria-label="Hero Info">
            <h1 className="hero-title">RAV4 HYBRID</h1>
            <p className="hero-price">Starting from ₮199,900,000</p>
            <p className="hero-description">Hybrid AWD, premium mid-size SUV</p>
        </section>
    );
}

function VehicleViewer() {
    return (
        <section className="vehicle-viewer" aria-label="Vehicle Viewer">
            <div className="vehicle-image">Vehicle Image</div>
        </section>
    );
}

function NavigationArrows() {
    return (
        <section className="navigation-arrows" aria-label="Navigation Arrows">
            <button type="button" className="nav-arrow nav-arrow-prev">
                ◀
            </button>
            <button type="button" className="nav-arrow nav-arrow-next">
                ▶
            </button>
        </section>
    );
}

function ActionButtons() {
    return (
        <section className="action-buttons" aria-label="Action Buttons">
            <button type="button" className="action-button">
                Дэлгэрэнгүй
            </button>
            <button type="button" className="action-button">
                Лизинг
            </button>
        </section>
    );
}

function ChatButton() {
    return (
        <aside className="chat-button" aria-label="Floating Chat Button" data-position="bottom-right-fixed">
            💬
        </aside>
    );
}

export default function Home() {
    return (
        <div className="home-page">
            <Header />
            <VehicleTabs />

            <section className="hero-section">
                <HeroInfo />
                <VehicleViewer />
                <NavigationArrows />
            </section>

            <ActionButtons />

            <ChatButton />
        </div>
    );
}