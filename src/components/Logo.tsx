import logoBlack from '../assets/brand/vialabs.svg';
import logoWhite from '../assets/brand/vialabs-dark.svg';

// Black logo on light backgrounds, white logo on dark. CSS picks one, so server and browser match.
export function Logo({ className = 'h-7' }: { className?: string }) {
    return (
        <>
            <img src={logoBlack} alt="VIA Labs" className={`${className} w-auto dark:hidden`} width={122} height={28} />
            <img src={logoWhite} alt="VIA Labs" className={`${className} w-auto hidden dark:block`} width={122} height={28} />
        </>
    );
}
