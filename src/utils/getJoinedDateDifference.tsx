export const getJoinedDateDifference = (createdAt) => {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();

    let years = currentDate.getFullYear() - createdDate.getFullYear();
    let months = currentDate.getMonth() - createdDate.getMonth();
    let days = currentDate.getDate() - createdDate.getDate();

    if (days < 0) {
        months -= 1;
        const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        days += prevMonth.getDate();
    }

    if (months < 0) {
        years -= 1;
        months += 12;
    }

    if (years > 0) return `Joined ${years} year${years > 1 ? 's' : ''} ago`;
    if (months > 0) return `Joined ${months} month${months > 1 ? 's' : ''} ago`;
    if (days > 0) return `Joined ${days} day${days > 1 ? 's' : ''} ago`;

    return 'Joined today';
};
