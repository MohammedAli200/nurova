/**
 * ClayCard Component
 * Refined claymorphic card with 3 tactile elevation levels.
 */
const ClayCard = ({
    children,
    level = "2",
    interactive = false,
    className = "",
    ...props
}) => {
    const levelClasses = {
        "1": "clay-surface-1",
        "2": "clay-surface-2",
        "3": "clay-surface-3",
    };

    return (
        <div
            className={`
                ${levelClasses[level] || levelClasses["2"]}
                ${interactive ? "clay-card-interactive cursor-pointer" : ""}
                p-6 sm:p-8
                ${className}
            `}
            {...props}
        >
            {children}
        </div>
    );
};

export default ClayCard;