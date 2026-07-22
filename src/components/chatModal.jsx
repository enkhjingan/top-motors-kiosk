export default function ChatModal({ isOpen, onClose, title, children }) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="chat-modal-overlay" onClick={onClose}>
            <div className="chat-modal" onClick={(event) => event.stopPropagation()}>
                <div className="chat-modal-header">
                    <div>
                        <h2 className="chat-modal-title">{title}</h2>
                        <p className="chat-modal-subtitle">Ask about models, trims, colors, or pricing.</p>
                    </div>
                    <button type="button" className="chat-modal-close" aria-label="Close chat" onClick={onClose}>
                        ×
                    </button>
                </div>
                <div className="chat-modal-content">{children}</div>
            </div>
        </div>
    );
}
