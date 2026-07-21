function localizeSpec(spec, language) {
    if (language === 'mn') {
        return {
            label: spec.labelMn || spec.label,
            value: spec.valueMn || spec.value
        };
    }

    return {
        label: spec.label,
        value: spec.value
    };
}

function Specifications({ specs, language }) {
    const itemCount = Math.max(specs.length, 1);

    return (
        <section className="specs-strip" aria-label="Vehicle specifications" style={{ '--spec-count': itemCount }}>
            {specs.map((spec) => {
                const localized = localizeSpec(spec, language);
                return (
                    <div key={`${localized.label}-${localized.value}`} className="spec-item">
                        <p className="spec-label">{localized.label}</p>
                        <p className="spec-value">{localized.value}</p>
                    </div>
                );
            })}
        </section>
    );
}

export default Specifications;
