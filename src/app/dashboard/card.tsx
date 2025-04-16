import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import classNames from 'classnames';

export default function Card({
    className,
    title,
    children,
}: Readonly<{
    className?: string;
    title?: React.ReactNode;
    children?: React.ReactNode;
}>) {
    return (
        <div className={classNames('bg-primary rounded-lg p-6 shadow-lg flex flex-col', className)}>
            {title && <div className="text-xl font-light mb-3">{title}</div>}
            {children}
        </div>
    );
}
