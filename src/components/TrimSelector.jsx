function localizeTrimName(trim, language) {
    if (language === 'mn') {
        return trim.nameMn || trim.name;
    }

    return trim.name;
}

function TrimSelector({ trims, selectedTrimId, onSelectTrim, language }) {
    return (
        <section className="trim-selector" aria-label="Variant selector">
            {trims.map((trim) => (
                <button
                    key={trim.id}
                    type="button"
                    className={`trim-button ${selectedTrimId === trim.id ? 'is-active' : ''}`}
                    onClick={() => onSelectTrim(trim.id)}
                >
                    {localizeTrimName(trim, language)}
                </button>
            ))}
        </section>
    );
}

export default TrimSelector;
