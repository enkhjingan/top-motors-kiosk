import { useLanguage } from '../hooks/useLanguage';

export default function LanguageSwitcher() {
	const { language, setLanguage } = useLanguage();

	return (
		<div className="language-switcher">
			<button
				className={`lang-btn ${language === 'eng' ? 'active' : ''}`}
				onClick={() => setLanguage('eng')}
				type="button"
			>
				EN
			</button>
			<button
				className={`lang-btn ${language === 'mn' ? 'active' : ''}`}
				onClick={() => setLanguage('mn')}
				type="button"
			>
				MN
			</button>
		</div>
	);
}
