import { useState } from "react";
import { evaluatePassword, type PasswordResult } from "@/lib/passwordChecker";
import { Eye, EyeOff, ShieldCheck, Shuffle, Check } from "lucide-react";

const Index = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [result, setResult] = useState<PasswordResult | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=";
    let pwd = "";
    // Guarantee at least one of each type
    pwd += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
    pwd += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
    pwd += "0123456789"[Math.floor(Math.random() * 10)];
    pwd += "!@#$%^&*()_+-="[Math.floor(Math.random() * 14)];
    for (let i = 4; i < 16; i++) {
      pwd += chars[Math.floor(Math.random() * chars.length)];
    }
    // Shuffle
    pwd = pwd.split("").sort(() => Math.random() - 0.5).join("");
    setPassword(pwd);
    setShowPassword(true);
    setSubmitted(false);
    setResult(null);
    navigator.clipboard.writeText(pwd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = () => {
    if (!password.trim()) return;
    // Simulates a POST request to Flask backend
    const res = evaluatePassword(password);
    setResult(res);
    setSubmitted(true);
  };

  const strengthPercent = result
    ? Math.round((result.score / 6) * 100)
    : 0;

  const strengthClass = result
    ? result.strength === "Weak"
      ? "strength-weak"
      : result.strength === "Medium"
      ? "strength-medium"
      : "strength-strong"
    : "";

  const strengthColor = result
    ? result.strength === "Weak"
      ? "text-[hsl(var(--neon-red))]"
      : result.strength === "Medium"
      ? "text-[hsl(var(--neon-yellow))]"
      : "text-[hsl(var(--neon-green))]"
    : "";

  return (
    <div className="min-h-screen bg-background bg-grid flex flex-col items-center justify-center px-4">
      {/* Title */}
      <div className="mb-8 text-center animate-fade-up">
        <div className="flex items-center justify-center gap-3 mb-3">
          <ShieldCheck className="w-8 h-8 text-[hsl(var(--neon-blue))]" />
          <h1
            className="text-3xl md:text-4xl font-bold tracking-wider"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Password Checker
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Analyze the strength of your password instantly
        </p>
      </div>

      {/* Card */}
      <div className="neon-card w-full max-w-md p-8 animate-fade-up" style={{ animationDelay: "0.1s" }}>
        {/* Input group */}
        <div className="relative mb-5">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setSubmitted(false);
              setResult(null);
            }}
            placeholder="Enter your password..."
            className="neon-input w-full rounded-lg px-4 py-3 pr-20 text-sm"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="toggle-btn absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="hidden sm:inline">{showPassword ? "Hide" : "Show"}</span>
          </button>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button onClick={handleSubmit} className="neon-btn flex-1">
            Analyze
          </button>
          <button onClick={generatePassword} className="generate-btn flex items-center justify-center gap-2">
            {copied ? <Check className="w-4 h-4" /> : <Shuffle className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? "Copied!" : "Generate"}</span>
          </button>
        </div>

        {/* Results */}
        {submitted && result && (
          <div className="mt-6 animate-fade-up">
            {/* Strength bar */}
            <div className="strength-bar mb-3">
              <div
                className={`strength-fill ${strengthClass}`}
                style={{ width: `${strengthPercent}%` }}
              />
            </div>

            {/* Strength label */}
            <p className="text-center mb-4">
              <span className="text-muted-foreground text-sm">Strength: </span>
              <span className={`font-semibold ${strengthColor}`} style={{ fontFamily: "var(--font-display)" }}>
                {result.strength}
              </span>
            </p>

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider" style={{ fontFamily: "var(--font-display)" }}>
                  Suggestions
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.suggestions.map((s, i) => (
                    <span key={i} className="suggestion-chip">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {result.strength === "Strong" && result.suggestions.length === 0 && (
              <p className="text-center text-sm text-[hsl(var(--neon-green))]">
                ✓ Your password is strong!
              </p>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-muted-foreground text-xs tracking-wide animate-fade-up" style={{ animationDelay: "0.2s" }}>
        Built by Aditya Bedi
      </footer>
    </div>
  );
};

export default Index;
