export default function ChatButton({ isOpen, onClick }) {
    return (
        <button
            type="button"
            className="chat-button"
            aria-expanded={isOpen}
            onClick={onClick}
        >
            {isOpen ? 'Close chat' : 'Chat with Toyota'}
        </button>
    );
}
