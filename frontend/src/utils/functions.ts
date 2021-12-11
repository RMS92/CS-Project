export function formatTitle(title: string): string {
  return (title + "").charAt(0).toUpperCase() + title.substr(1);
}

// Format card description
export function formatDescription(description: string): String {
  if (description.length < 130) {
    return description;
  }
  const newDescription = description.slice(0, 130);
  return newDescription.concat("...");
}

// Find day diff for comment
export function dateDiff(createdAt: Date, short: boolean = false) {
  const now = Date.now();
  let diffInMilliSeconds = Math.abs(createdAt.getTime() - now) / 1000;
  // calculate month
  const months = Math.floor(diffInMilliSeconds / 2628000);

  // calculate days
  const days = Math.floor(diffInMilliSeconds / 86400);
  diffInMilliSeconds -= days * 86400;

  // calculate hours
  const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
  diffInMilliSeconds -= hours * 3600;

  // calculate minutes
  const minutes = Math.floor(diffInMilliSeconds / 60) % 60;

  let difference = "";

  if (!short) {
    difference = "Il y a ";
  }

  if (months > 0) {
    difference += `${months} mois.`;
  } else {
  }

  if (days > 0 && days < 30) {
    difference += days === 1 ? `${days} jour.` : `${days} jours.`;
  } else {
  }

  if (hours > 0 && days === 0) {
    difference +=
      hours === 0 || hours === 1 ? `${hours} heure.` : `${hours} heures.`;
  }

  if (hours === 0 && days === 0) {
    difference +=
      minutes === 0 || minutes === 1
        ? `${minutes} minute.`
        : `${minutes} minutes.`;
  }

  return difference;
}
