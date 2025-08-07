/**
 * Formatiert einen Namen zu Vorname + Initial des Nachnamens
 * z.B. "Max Mustermann" wird zu "Max M."
 */
export const formatNameWithInitial = (firstName: string | null, lastName: string | null): string => {
  if (!firstName && !lastName) {
    return 'Anonymer Nutzer';
  }
  
  if (!firstName) {
    return lastName ? `${lastName.charAt(0)}.` : 'Anonymer Nutzer';
  }
  
  if (!lastName) {
    return firstName;
  }
  
  return `${firstName} ${lastName.charAt(0)}.`;
};