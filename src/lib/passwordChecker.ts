/**
 * Password Strength Evaluation Module
 * Mirrors the logic that would run in a Flask backend (app.py).
 * Evaluates password based on: length, uppercase, lowercase, numbers, special chars.
 */

export interface PasswordResult {
  strength: "Weak" | "Medium" | "Strong";
  score: number; // 0-5
  suggestions: string[];
}

export function evaluatePassword(password: string): PasswordResult {
  let score = 0;
  const suggestions: string[] = [];

  // Check length
  if (password.length >= 8) {
    score += 1;
  } else {
    suggestions.push("Use at least 8 characters");
  }

  if (password.length >= 12) {
    score += 1;
  } else if (password.length >= 8) {
    suggestions.push("Use 12+ characters for extra security");
  }

  // Check uppercase letters
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    suggestions.push("Add uppercase letters (A-Z)");
  }

  // Check lowercase letters
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    suggestions.push("Add lowercase letters (a-z)");
  }

  // Check numbers
  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    suggestions.push("Add numbers (0-9)");
  }

  // Check special characters
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 1;
  } else {
    suggestions.push("Add special characters (!@#$%...)");
  }

  // Determine strength level
  let strength: PasswordResult["strength"];
  if (score <= 2) {
    strength = "Weak";
  } else if (score <= 4) {
    strength = "Medium";
  } else {
    strength = "Strong";
  }

  return { strength, score, suggestions };
}
