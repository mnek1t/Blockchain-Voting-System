interface BVS_CardProps {
    href: string;
    className?: string,
    label: string,
}
const BVS_Card = ({href, className, label} : BVS_CardProps) => {
    return(
        <a href={href} className={className}>
            {label}
        </a>
    );
}

export default BVS_Card;