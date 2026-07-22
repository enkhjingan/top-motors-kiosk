function localizeTrimName(trim, language) {
    const trimName = trim.name || trim.id;
    const trimNameMn = trim.nameMn || trim.name || trim.id;

    if (language === 'mn') {
        return trimNameMn;
    }

    return trimName;
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
