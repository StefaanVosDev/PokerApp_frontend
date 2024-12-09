export const getStatusColor = (status: string): string => {
    switch (status) {
        case "IN_PROGRESS":
            return "green";
        case "FINISHED":
            return "gray";
        case "WAITING":
            return "yellow";
        default:
            return "white";  // Default color in case the status doesn't match any of the above
    }
};
