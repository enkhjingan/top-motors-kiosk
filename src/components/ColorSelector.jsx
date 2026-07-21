function ColorSelector({ colors, selectedColorName, onSelectColor }) {
    const currentColor = colors.find((color) => color.name === selectedColorName) || colors[0] || null;

    return (
        <section className="color-labels" aria-label="Color options">
            {currentColor ? <p className="color-label-current">Color: {currentColor.name}</p> : null}
            {colors.map((color) => (
                <button
                    key={color.name}
                    type="button"
                    className={`color-label color-label-button ${selectedColorName === color.name ? 'is-active' : ''}`}
                    onClick={() => onSelectColor(color.name)}
                    aria-label={`Color ${color.name}`}
                >
                    <span className="color-swatch" style={{ backgroundColor: color.hex }} aria-hidden="true" />
                    {selectedColorName === color.name ? <span className="color-check" aria-hidden="true" /> : null}
                </button>
            ))}
        </section>
    );
}

export default ColorSelector;
