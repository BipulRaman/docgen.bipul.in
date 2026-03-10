import { useState } from "react";

interface Props {
  onSuccess: () => void;
}

function getIstPin(): string {
  const now = new Date();
  const ist = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const hh = String(ist.getHours()).padStart(2, "0");
  const mm = String(ist.getMinutes()).padStart(2, "0");
  return `${hh}${mm}`;
}

function PinScreen({ onSuccess }: Props) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === getIstPin()) {
      setError(false);
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="pin-overlay">
      <form className="pin-box" onSubmit={handleSubmit}>
        <h2>🔒 Enter PIN</h2>
        <p className="pin-hint">Enter the 4-digit access PIN</p>
        <input
          className="pin-input"
          type="password"
          maxLength={4}
          inputMode="numeric"
          pattern="\d{4}"
          autoComplete="off"
          autoFocus
          value={pin}
          onChange={(e) => {
            setPin(e.target.value.replace(/\D/g, ""));
            setError(false);
          }}
        />
        {error && <p className="pin-error">Incorrect PIN. Try again.</p>}
        <button className="pin-btn" type="submit">
          Unlock
        </button>
      </form>
    </div>
  );
}

export default PinScreen;
